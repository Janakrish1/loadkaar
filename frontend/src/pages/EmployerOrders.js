import React, { useState } from "react";
import "../styles/EmployerOrders.css"; // CSS for styling
import CurrentTaskRender from "./CurrentTaskRender";

const EmployerOrders = ({ enrichedOrders }) => {
  const [expandedOrder, setExpandedOrder] = useState(null); // Tracks the currently expanded order
  const [currentMapTask, setCurrentMapTask] = useState(null); // Tracks the task for which the map is displayed

  const handleExpand = (id) => {
    setExpandedOrder(id);
  };

  const handleBack = () => {
    setExpandedOrder(null);
  };

  const handleViewMap = (id) => {
    setExpandedOrder(null);
    setCurrentMapTask(id);
  };

  return (
    <div className="task-review-container">
      {/* Map Display Section */}
      {currentMapTask && (
        <div className="map-container">
          <h3>Status Map for Task ID: {currentMapTask}</h3>
          <div className="map-render">
            {<CurrentTaskRender />}
            <p>Map rendering for task {currentMapTask} will appear here.</p>
          </div>
        </div>
      )}

      {/* Task Cards */}
      <div className="task-cards-container">
        {enrichedOrders.map((order, index) => (
          <div
            key={index}
            className={`review-card ${expandedOrder === index ? "expanded" : ""}`}
            onClick={() => handleExpand(index)}
          >
            <p>
              <strong>Employee Name:</strong> {order.employeeName}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="status-highlight">{order.taskStatus}</span>
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
            <p>
              <strong>Employee Name:</strong> {order.employeeName}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded Order View */}
      {expandedOrder !== null && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Task Details</h3>
            <div>
              <p>
                <strong>Task ID:</strong> {expandedOrder + 1}
              </p>
              <p>
                <strong>Status:</strong> {enrichedOrders[expandedOrder].taskStatus}
              </p>
              <p>
                <strong>Payment:</strong> {enrichedOrders[expandedOrder].payment}
              </p>
              <p>
                <strong>Vehicle Type:</strong> {enrichedOrders[expandedOrder].vehicleType}
              </p>
              <p>
                <strong>Source:</strong> {enrichedOrders[expandedOrder].source}
              </p>
              <p>
                <strong>Destination:</strong> {enrichedOrders[expandedOrder].destination}
              </p>
              <p>
                <strong>Item Description:</strong> {enrichedOrders[expandedOrder].itemDescription}
              </p>
              <p>
                <strong>Employee Name:</strong> {enrichedOrders[expandedOrder].employeeName}
              </p>
            </div>
            <div className="button-group">
              <button
                onClick={() => handleViewMap(expandedOrder)}
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
