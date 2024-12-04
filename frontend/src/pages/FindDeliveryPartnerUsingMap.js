import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import "../styles/FindDeliveryPartnerUsingMap.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const GOOGLE_API_KEY = "AIzaSyC0EhlKGTmN0TpCybSrFsJcF-hS6wH-r4Y";

const FindDeliveryPartnerUsingMap = () => {
  const { userID } = useSelector((state) => state.user);
  const {
    pickupLocation,
    dropLocation,
    vehicleType,
  } = useSelector((state) => state.deliveryPartnerView.deliveryForm || {});

  const [sourceLocation, setSourceLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google && pickupLocation && dropLocation) {
      const geoCoder = new window.google.maps.Geocoder();

      geoCoder.geocode({ address: pickupLocation }, (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;
          setSourceLocation({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });

      geoCoder.geocode({ address: dropLocation }, (results, status) => {
        if (status === "OK") {
          const location = results[0].geometry.location;
          setDestinationLocation({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });
    }
  }, [pickupLocation, dropLocation]);

  useEffect(() => {
    const fetchDrivers = async () => {
      if (sourceLocation && destinationLocation) {
        try {
          const response = await axios.post(
            "http://localhost:5001/api/find-drivers",
            { sourceLocation, vehicleType }
          );
          const data = response.data.results;

          setDrivers(data);

          const filteredDrivers = await filterDriversByDistance(
            data,
            sourceLocation,
            5
          );
          setActiveDrivers(filteredDrivers);
        } catch (error) {
          console.error("Error fetching drivers:", error);
        }
      }
    };

    fetchDrivers();
  }, [sourceLocation, destinationLocation]);

  const filterDriversByDistance = (drivers, sourceLocation, maxDistanceKm) => {
    return new Promise((resolve) => {
      // const distanceService = new window.google.maps.DistanceMatrixService();
      //       distanceService.getDistanceMatrix(
      //           {
      //               origins: [formData.pickupLocation],
      //               destinations: [formData.dropLocation],
      //               travelMode: window.google.maps.TravelMode.DRIVING,
      //           },
      //           (response, status) => {
      //               if (status === "OK") {
      //                   const distance = response.rows[0].elements[0].distance.text;
      //                   const duration = response.rows[0].elements[0].duration.text;
      //                   setFormData((prevData) => ({ ...prevData, distance, duration }));
      //                   setDistance(distance);
      //                   setDuration(duration);

      //                   console.log(distance, duration);
      //                   resolve(true); // Resolve the promise when data is set
      //               } else {
      //                   alert("Distance request failed due to " + status);
      //                   reject(false); // Reject the promise on failure
      //               }
      //           }
      //       );

      const service = new window.google.maps.DistanceMatrixService();

      const origins = drivers.map(
        (driver) =>
          new window.google.maps.LatLng(
            parseFloat(driver.lat),
            parseFloat(driver.lng)
          )
      );
      const destination = new window.google.maps.LatLng(
        sourceLocation.lat,
        sourceLocation.lng
      );

      service.getDistanceMatrix(
        {
          origins,
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK") {
            const filteredDrivers = response.rows
              .map((row, index) => {
                const distance = row.elements[0].distance.value / 1000;
                const duration = row.elements[0].duration.text;
                console.log(duration);
                  return {
                    ...drivers[index],
                    distance,
                    duration,
                  };
              })
              .filter((driver) => driver !== null);

            resolve(filteredDrivers);
          } else {
            console.error("Distance Matrix service failed:", status);
            resolve([]);
          }
        }
      );
    });
  };

  const handleCardClick = (driver) => {
    setSelectedDriver(driver);
    setShowDriverPopup(true);
  };

  const closeDriverPopup = () => {
    setShowDriverPopup(false);
    setSelectedDriver(null);
  };

  const handleAssignTask = () => {
    closeDriverPopup();
    navigate("/payment", { state: { selectedDriver } });
  };
  const [ratings, setRatings] = useState({}); // State to store ratings for each driver
  const fetchRating = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/get-rating",
        { user_id: userId }
      );
      if (response.status === 200) {
        return parseFloat(response.data.averageRating); // Return the rating from the response
      } else {
        console.error("Failed to fetch rating, defaulting to 5.");
        return 5; // Default to 5 if no rating is received
      }
    } catch (error) {
      console.error("Error fetching rating:", error);
      return 5; // Default to 5 in case of an error
    }
  };

  useEffect(() => {
    // Fetch ratings for all active drivers
    const loadRatings = async () => {
      const newRatings = {};
      for (const driver of activeDrivers) {
        const rating = await fetchRating(driver.user_id);
        newRatings[driver.user_id] = rating;
      }
      setRatings(newRatings); // Update state with fetched ratings
    };

    if (activeDrivers.length > 0) {
      loadRatings();
    }
  }, [activeDrivers]);

  return (
    <div className="container">
      <div className="left-pane">
        <div className="delivery-partners-container">
          {activeDrivers.length === 0 ? (
            <p>Loading delivery partners...</p>
          ) : (
            activeDrivers.map((partner, index) => (
              <div
                key={partner.user_id || index}
                className="card"
                onClick={() => handleCardClick(partner)}
              >
                <h3>
                  {partner.firstname} {partner.lastname}
                </h3>
                <h4>Estimated Time: {partner.duration}</h4>
                <h4>Estimated Price in INR: ₹{partner.estimated_price.toFixed(2)}</h4>
                <p>
                  Rating:{" "}
                  {ratings[partner.user_id]
                    ? `${ratings[partner.user_id]} ⭐`
                    : "Loading..."}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="right-pane">
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "500px" }}
            center={sourceLocation || { lat: 0, lng: 0 }}
            zoom={14}
          >
            {sourceLocation && (
              <Marker
                position={sourceLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            )}
            {drivers.map((driver) => (
              <Marker
                key={driver.user_id}
                position={{
                  lat: parseFloat(driver.lat),
                  lng: parseFloat(driver.lng),
                }}
                onClick={() => setSelectedDriver(driver)}
              />
            ))}

            {selectedDriver && selectedDriver.lat && selectedDriver.lng && (
              <InfoWindow
                position={{ lat: parseFloat(selectedDriver.lat), lng: parseFloat(selectedDriver.lng) }}
                onCloseClick={() => setSelectedDriver(null)}
              >
                <div>
                  <h3>{selectedDriver.firstname} {selectedDriver.lastname}</h3>
                  <p>
                  Rating:{" "}
                  {ratings[selectedDriver.user_id]
                    ? `${ratings[selectedDriver.user_id]} ⭐`
                    : "Loading..."}
                </p>
                </div>
              </InfoWindow>
            )}

          </GoogleMap>
        </div>
      </div>

      {showDriverPopup && selectedDriver && (
        <div className="popup-overlay">
          {/* {console.log(showDriverPopup, selectedDriver)} */}
          <div className="popup-content">
            <h3>Driver Details</h3>
            {console.log(selectedDriver)}
            <h2>Name: {`${selectedDriver.firstname} ${selectedDriver.lastname}`}</h2>
            <h4>Kilometers away: {selectedDriver.distance.toFixed(2)} km</h4>
            <h4>Estimated Time: {selectedDriver.duration}</h4>
            <h4>Estimated Price in INR: ₹{selectedDriver.estimated_price.toFixed(2)}</h4>
            <p>
                  Rating:{" "}
                  {ratings[selectedDriver.user_id]
                    ? `${ratings[selectedDriver.user_id]} ⭐`
                    : "Loading..."}
                </p>
            <div className="popup-buttons">
              <button onClick={closeDriverPopup}>Back</button>
              <button onClick={handleAssignTask}>Assign Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindDeliveryPartnerUsingMap;
