import React, { useEffect, useState, useRef, useMemo } from "react";
import { GoogleMap, Marker, LoadScript, InfoWindow } from "@react-google-maps/api";
import "../styles/CurrentTaskRender.css";

const API_KEY = "AIzaSyC0EhlKGTmN0TpCybSrFsJcF-hS6wH-r4Y"; // Replace with your actual API key

const CurrentTaskRender = () => {
  // Wrap employeeLocation in useMemo to prevent unnecessary re-renders
  const employeeLocation = useMemo(() => ({ lat: 40.73061, lng: -79.00000 }), []); // Example employee location
  const [userLocation, setUserLocation] = useState(null); // User's initial location
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  const directionsRenderer = useRef(null); // To render the directions on the map
  const directionsService = useRef(null); // To calculate the directions

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
    if (userLocation) {
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
            setDistanceInfo({
              distance: result.distance.text,
              duration: result.duration.text,
            });
          } else {
            console.error("Distance Matrix request failed:", status);
          }
        }
      );
    }
  }, [userLocation, employeeLocation]); // Add `employeeLocation` to the dependency array

  // Initialize directions renderer and service
  useEffect(() => {
    if (userLocation && directionsService.current && directionsRenderer.current) {
      const directionsRequest = {
        origin: userLocation,
        destination: employeeLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.current.route(directionsRequest, (response, status) => {
        if (status === "OK") {
          directionsRenderer.current.setDirections(response);
        } else {
          console.error("Directions request failed:", status);
        }
      });
    }
  }, [userLocation, employeeLocation]); // Add `employeeLocation` to the dependency array

  return (
    <div className="task-container">
      <LoadScript googleMapsApiKey={API_KEY}>
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
            position={employeeLocation}
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
              position={employeeLocation}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h3>Employee Location</h3>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      {distanceInfo && (
        <div className="info-panel">
          <h2>Employee Arrival Info</h2>
          <p><strong>Distance:</strong> {distanceInfo.distance}</p>
          <p><strong>Estimated Time of Arrival:</strong> {distanceInfo.duration}</p>
        </div>
      )}
    </div>
  );
};

export default CurrentTaskRender;

