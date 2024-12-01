import React, { useState } from "react";
import "../styles/EmployerOrders.css"; // CSS for styling
import CurrentTaskRender from "./CurrentTaskRender";

const EmployerOrders = ({ enrichedOrders }) => {
  const [expandedOrderIndex, setExpandedOrderIndex] = useState(null); // Tracks the currently expanded order by index
  const [currentMapOrderIndex, setCurrentMapOrderIndex] = useState(null); // Tracks the order index for which the map is displayed

  const handleExpand = (index) => {
    setExpandedOrderIndex(index);
  };

  const handleBack = () => {
    setExpandedOrderIndex(null);
  };

  const handleViewMap = (index) => {
    setExpandedOrderIndex(null);
    setCurrentMapOrderIndex(index);
  };

  return (
    <div className="task-review-container">
      {/* Map Display Section */}
      {currentMapOrderIndex !== null && (
        <div className="map-container">
          <h3>Status Map for Task {currentMapOrderIndex + 1}</h3>
          <div className="map-render">
            <CurrentTaskRender />
            <p>Map rendering for task {currentMapOrderIndex + 1} will appear here.</p>
          </div>
        </div>
      )}

      {/* Task Cards */}
      <div className="task-cards-container">
        {enrichedOrders.map((order, index) => (
          <div
            key={index}
            className={`review-card ${expandedOrderIndex === index ? "expanded" : ""}`}
            onClick={() => handleExpand(index)}
          >
            <p>
              <strong>Employee Name:</strong> {order.employeeName}
            </p>
            <p>
              <strong>Status:</strong> <span className="status-highlight">{order.taskStatus}</span>
            </p>
            <p>
              <strong>Payment:</strong> {order.payment}
            </p>
            <p>
              <strong>Vehicle Type:</strong> {order.vehicleType}
            </p>
            <p>
              <strong>Source:</strong> {order.source}
            </p>
            <p>
              <strong>Destination:</strong> {order.destination}
            </p>
            <p>
              <strong>Item Description:</strong> {order.itemDescription}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded Order View */}
      {expandedOrderIndex !== null && (
        <div className="popup-overlay">
          <div className="popup-card">
            <div>
              <p>
                <strong>Employee Name:</strong> {enrichedOrders[expandedOrderIndex].employeeName}
              </p>
              <p>
                <strong>Status:</strong> {enrichedOrders[expandedOrderIndex].taskStatus}
              </p>
              <p>
                <strong>Payment:</strong> {enrichedOrders[expandedOrderIndex].payment}
              </p>
              <p>
                <strong>Vehicle Type:</strong> {enrichedOrders[expandedOrderIndex].vehicleType}
              </p>
              <p>
                <strong>Source:</strong> {enrichedOrders[expandedOrderIndex].source}
              </p>
              <p>
                <strong>Destination:</strong> {enrichedOrders[expandedOrderIndex].destination}
              </p>
              <p>
                <strong>Item Description:</strong> {enrichedOrders[expandedOrderIndex].itemDescription}
              </p>
            </div>
            <div className="button-group">
              <button
                onClick={() => handleViewMap(expandedOrderIndex)}
                className="view-map-button"
              >
                View Map
              </button>
              <button onClick={handleBack} className="back-button">
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerOrders;