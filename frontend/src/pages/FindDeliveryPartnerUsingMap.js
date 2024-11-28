import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript, InfoWindow } from "@react-google-maps/api";
import "../styles/FindDeliveryPartnerUsingMap.css";
import { useNavigate } from "react-router-dom";

const FindDeliveryPartnerUsingMap = () => {
  // const { ...deliveryFormData } = useSelector((state) => (state.deliveryPartnerView));
  const [currentLocation, setCurrentLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current location using the browser's geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  useEffect(() => {
    // console.log(deliveryFormData.formData)
    if (currentLocation) {
      // Static dummy drivers data
      const dummyDrivers = [
        { id: 1, name: "Driver A", lat: 40.4615, lng: -79.9398, status: "active", vehicleType: "Bike", rating: 4.5 },
        { id: 2, name: "Driver B", lat: 40.4615 + 0.001, lng: -79.9398 + 0.001, status: "inactive", vehicleType: "Van", rating: 4.8 },
        { id: 3, name: "Driver C", lat: 40.4615 - 0.001, lng: -79.9398 - 0.001, status: "active", vehicleType: "Truck", rating: 4.2 },
        { id: 4, name: "Driver D", lat: 40.4615 + 0.002, lng: -79.9398 + 0.002, status: "inactive", vehicleType: "Bike", rating: 4.0 },
      ];

      // Filter drivers that are active
      const activeDrivers = dummyDrivers.filter(driver => driver.status === "active");
      setDrivers(activeDrivers);

      // Filter active drivers and those within 5km
      filterDriversByDistance(activeDrivers, currentLocation, 5).then(filteredDrivers => {
        setActiveDrivers(filteredDrivers);
        console.log('Filtered Drivers:', filteredDrivers);
      });
    }
  }, [currentLocation]);

  const filterDriversByDistance = (drivers, currentLocation, maxDistanceKm) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const service = new window.google.maps.DistanceMatrixService();

        const origins = drivers.map(driver => new window.google.maps.LatLng(driver.lat, driver.lng));
        const destination = new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng);

        service.getDistanceMatrix(
          {
            origins,
            destinations: [destination],
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === "OK") {
              const filteredDrivers = response.rows.map((row, index) => {
                const distance = row.elements[0].distance.value / 1000;
                console.log(`Driver ${drivers[index].name}: Distance = ${distance} km`);

                if (distance <= maxDistanceKm) {
                  return drivers[index];
                }
                return null;
              }).filter(driver => driver !== null);
              resolve(filteredDrivers);
            } else {
              console.error("Distance Matrix service failed:", status);
              resolve([]);
            }
          }
        );
      }, 1000);
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
    navigate("/payment", {state: {selectedDriver}});
  };

  return (
    <div className="container">
      <div className="left-pane">
        <div className="delivery-partners-container">
          {activeDrivers.length === 0 ? (
            <p>Loading delivery partners...</p>
          ) : (
            activeDrivers.map((partner) => (
              <div
                key={partner.id}
                className="card"
                onClick={() => handleCardClick(partner)}
              >
                <h3>{partner.name}</h3>
                <p>Vehicle: {partner.vehicleType}</p>
                <p>Rating: {partner.rating} ⭐</p>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="right-pane">
        <div className="map-container">
          <LoadScript googleMapsApiKey="AIzaSyC0EhlKGTmN0TpCybSrFsJcF-hS6wH-r4Y">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "500px" }}
              center={currentLocation || { lat: 0, lng: 0 }}
              zoom={14}
            >
              {currentLocation && (
                <Marker
                  position={currentLocation}
                  icon={{ url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }}
                />
              )}
              {drivers.map(driver => (
                <Marker
                  key={driver.id}
                  position={{ lat: driver.lat, lng: driver.lng }}
                  onClick={() => setSelectedDriver(driver)}
                />
              ))}
              {selectedDriver && (
                <InfoWindow
                  position={{ lat: selectedDriver.lat, lng: selectedDriver.lng }}
                  onCloseClick={() => setSelectedDriver(null)}
                >
                  <div>
                    <h3>{selectedDriver.name}</h3>
                    <p>Vehicle: {selectedDriver.vehicleType}</p>
                    <p>Rating: {selectedDriver.rating}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      {showDriverPopup && selectedDriver && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Driver Details</h3>
            <p>Name: {selectedDriver.name}</p>
            <p>Vehicle: {selectedDriver.vehicleType}</p>
            <p>Rating: {selectedDriver.rating} ⭐</p>
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
