import React, { useState } from "react";
import "../styles/VehiclesPage.css"; // Create a CSS file for styling
import axios from "axios";

function VehiclesPage() {
  // State for managing vehicles
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState("");

  // Handle adding a new vehicle
  const handleAddVehicle = async () => {
    if (!newVehicle.trim()) {
      alert("Please enter a valid vehicle name.");
      return;
    }

    // Example API call to save the vehicle to the database
    try {
      const response = await axios.post("/api/vehicles", {
        name: newVehicle,
        isActive: false,
      });
      setVehicles([...vehicles, response.data]); // Add new vehicle to the list
      setNewVehicle(""); // Clear input
    } catch (error) {
      console.error("Error adding vehicle:", error);
      alert("Failed to add vehicle. Please try again.");
    }
  };

  // Handle removing a vehicle
  const handleRemoveVehicle = async (id) => {
    try {
      await axios.delete(`/api/vehicles/${id}`); // API call to delete vehicle
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id)); // Remove vehicle from list
    } catch (error) {
      console.error("Error removing vehicle:", error);
      alert("Failed to remove vehicle. Please try again.");
    }
  };

  // Handle toggling active/inactive status
  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const response = await axios.put(`/api/vehicles/${id}`, {
        isActive: !currentStatus,
      }); // Update vehicle's active status in the database
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.id === id ? { ...vehicle, isActive: response.data.isActive } : vehicle
        )
      );
    } catch (error) {
      console.error("Error toggling vehicle status:", error);
      alert("Failed to update vehicle status. Please try again.");
    }
  };

  return (
    <div className="vehicles-container">
      <h1>Manage Vehicles</h1>
      
      {/* Add Vehicle Section */}
      <div className="add-vehicle">
        <input
          type="text"
          placeholder="Enter vehicle name or ID"
          value={newVehicle}
          onChange={(e) => setNewVehicle(e.target.value)}
        />
        <button onClick={handleAddVehicle}>Add Vehicle</button>
      </div>

      {/* Vehicle List Section */}
      <div className="vehicles-list">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="vehicle-item">
              <span className="vehicle-name">{vehicle.name}</span>
              
              {/* Toggle Button for Active/Inactive */}
              <label className="switch">
                <input
                  type="checkbox"
                  checked={vehicle.isActive}
                  onChange={() => toggleActiveStatus(vehicle.id, vehicle.isActive)}
                />
                <span className="slider"></span>
              </label>
              <span className="status-text">
                {vehicle.isActive ? "Active" : "Inactive"}
              </span>

              {/* Remove Button */}
              <button
                className="remove-button"
                onClick={() => handleRemoveVehicle(vehicle.id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>No vehicles added yet.</p>
        )}
      </div>
    </div>
  );
}

export default VehiclesPage;
