import React, { useState, useEffect } from "react";
import "../styles/FindDeliveryPartner.css"; // Add styles for the component

const FindDeliveryPartners = () => {
  // Static data simulating API response
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      // Simulating delay
      setTimeout(() => {
        
        // const response = await axios.get("MAP_URL");

        // Find employees with vehicle and status active
        const dummyDrivers = [
          {
            id: 1,
            name: "Driver A",
            lat: 40.7278,  // Within 5 km radius of NYC
            lng: -74.0024, // Adjusted longitude
            status: "active",
            vehicleType: "Bike",
            rating: 4.5,
          },
          {
            id: 2,
            name: "Driver B",
            lat: 40.7180,  // Within 5 km radius of NYC
            lng: -74.0160, // Adjusted longitude
            status: "inactive",
            vehicleType: "Van",
            rating: 4.8,
          },
          {
            id: 3,
            name: "Driver C",
            lat: 40.7251,  // Within 5 km radius of NYC
            lng: -73.9952, // Adjusted longitude
            status: "active",
            vehicleType: "Truck",
            rating: 4.2,
          },
          {
            id: 4,
            name: "Driver D",
            lat: 40.7355,  // Within 5 km radius of NYC
            lng: -73.9915, // Adjusted longitude
            status: "active",
            vehicleType: "Bike",
            rating: 4.0,
          },
        ];
        

        // Calculating 5 km


        setData([
          { id: 1, name: "John Doe", vehicleType: "Bike", rating: 4.5 },
          { id: 2, name: "Jane Smith", vehicleType: "Van", rating: 4.8 },
          { id: 3, name: "Michael Johnson", vehicleType: "Truck", rating: 4.2 },
        ]);
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <div className="delivery-partners-container">
      {data.length === 0 ? (
        <p>Loading delivery partners...</p>
      ) : (
        data.map((partner) => (
          <div key={partner.id} className="card">
            <h3>{partner.name}</h3>
            <p>Vehicle: {partner.vehicleType}</p>
            <p>Rating: {partner.rating} ⭐</p>
          </div>
        ))
      )}
    </div>
  );
};

export default FindDeliveryPartners;
