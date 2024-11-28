/* global google */

import React, { useEffect, useState, useRef, useMemo } from "react";
import { GoogleMap, Marker, LoadScript, InfoWindow } from "@react-google-maps/api";
import "../styles/CurrentTaskRender.css";

const API_KEY = "AIzaSyC0EhlKGTmN0TpCybSrFsJcF-hS6wH-r4Y"; // Replace with your actual API key

const CurrentTaskRender = () => {
  const employeeLocation = useMemo(() => ({ lat: 40.73061, lng: -79.00000 }), []); // Example employee location
  const [userLocation, setUserLocation] = useState(null); // User's initial location
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [employeePosition, setEmployeePosition] = useState(employeeLocation); // Current position of employee
  const [employeePath, setEmployeePath] = useState([]); // Employee's route path
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);

  const directionsRenderer = useRef(null); // To render the directions on the map
  const directionsService = useRef(null); // To calculate the directions

  // Store the interval ID for clearing later
  const intervalRef = useRef(null);

  useEffect(() => {
    // Get user's current location only once
    if (!userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching user location: ", error);
        }
      );
    }
  }, [userLocation]); // Dependency is `userLocation` to ensure it runs only once

  // Fetch distance and ETA using Google Distance Matrix API
  useEffect(() => {
    if (userLocation && window.google) {
      const distanceMatrixService = new window.google.maps.DistanceMatrixService();
      distanceMatrixService.getDistanceMatrix(
        {
          origins: [employeeLocation],
          destinations: [userLocation],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            const result = response.rows[0].elements[0];
            setRemainingDistance(result.distance.value); // in meters
            setRemainingTime(result.duration.value); // in seconds
          } else {
            console.error("Distance Matrix request failed:", status);
          }
        }
      );
    }
  }, [userLocation, employeeLocation]);

  // Initialize directions renderer and service
  useEffect(() => {
    if (userLocation && directionsService.current && directionsRenderer.current && window.google) {
      const directionsRequest = {
        origin: userLocation,
        destination: employeeLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.current.route(directionsRequest, (response, status) => {
        if (status === "OK") {
          directionsRenderer.current.setDirections(response);
          const path = response.routes[0].overview_path;
          setEmployeePath(path); // Store the path
        } else {
          console.error("Directions request failed:", status);
        }
      });
    }
  }, [userLocation, employeeLocation]);

  // Function to animate the employee's marker along the path
  useEffect(() => {
    if (employeePath.length === 0 || remainingDistance <= 0) return;

    const totalPathLength = google.maps.geometry.spherical.computeLength(employeePath);
    const totalDuration = remainingTime;
    const intervalTime = Math.min(20000, (totalDuration * 1000) / totalPathLength);

    let progress = 0;
    const pathInterval = setInterval(() => {
      progress += 0.01; // Move 1% of the path every interval
      if (progress <= 1) {
        const index = Math.floor(progress * (employeePath.length - 1));
        const latLng = employeePath[index];
        setEmployeePosition(latLng);

        // Update remaining distance and time
        const progressDistance = progress * remainingDistance;
        const newRemainingTime = (totalDuration * (1 - progress)).toFixed(0);
        setRemainingDistance(remainingDistance - progressDistance);
        setRemainingTime(newRemainingTime);
      } else {
        clearInterval(pathInterval); // Stop once the employee reaches the end of the path
      }
    }, intervalTime);

    intervalRef.current = pathInterval;

    return () => clearInterval(pathInterval); // Clear the interval on cleanup
  }, [employeePath, remainingDistance, remainingTime]);

  return (
    <div className="task-container">
      <LoadScript googleMapsApiKey={API_KEY} libraries={['geometry']}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={userLocation || { lat: 0, lng: 0 }}
          zoom={14}
          onLoad={(map) => {
            directionsService.current = new window.google.maps.DirectionsService();
            directionsRenderer.current = new window.google.maps.DirectionsRenderer();
            directionsRenderer.current.setMap(map);
          }}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
              onClick={() => setSelectedMarker("User")}
            />
          )}
          <Marker
            position={employeePosition}
            icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
            onClick={() => setSelectedMarker("Employee")}
          />
          {selectedMarker === "User" && userLocation && (
            <InfoWindow position={userLocation} onCloseClick={() => setSelectedMarker(null)}>
              <div>
                <h3>Your Location</h3>
              </div>
            </InfoWindow>
          )}
          {selectedMarker === "Employee" && (
            <InfoWindow
              position={employeePosition}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h3>Employee Location</h3>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      {remainingDistance && remainingTime && (
        <div className="info-panel">
          <h2>Employee Arrival Info</h2>
          <p><strong>Remaining Distance:</strong> {(remainingDistance / 1000).toFixed(2)} km</p>
          <p><strong>Remaining Time:</strong> {Math.floor(remainingTime / 60)} minutes</p>
        </div>
      )}
    </div>
  );
};

export default CurrentTaskRender;
