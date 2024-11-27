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
