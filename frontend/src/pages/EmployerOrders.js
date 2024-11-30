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
            {<CurrentTaskRender  />}
            <p>Map rendering for task {currentMapTask} will appear here.</p>
          </div>
        </div>
      )}

      {/* Task Cards */}
      <div className="task-cards-container">
        {enrichedOrders.map((order) => (
          <div
            key={order.task.task_id}
            className={`review-card ${expandedOrder === order.task.task_id ? "expanded" : ""}`}
            onClick={() => handleExpand(order.task.task_id)}
          >
            <h3>Task ID: {order.task.task_id}</h3>
            <p>
              <strong>Status:</strong>{" "}
              <span className="status-highlight">{order.taskDetails[0].taskStatus}</span>
            </p>
            <p>
              <strong>Payment:</strong> {order.paymentDetails[0].amount} ({order.paymentDetails[0].status})
            </p>
            <p>
              <strong>Vehicle Type:</strong> {order.taskDetails[0].vehicleType}
            </p>
            <p>
              <strong>Source:</strong> {order.taskDetails[0].pickupLocation}
            </p>
            <p>
              <strong>Destination:</strong> {order.taskDetails[0].dropLocation}
            </p>
            <p>
              <strong>Item Description:</strong> {order.taskDetails[0].itemDescription}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded Order View */}
      {expandedOrder && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Task Details</h3>
            {enrichedOrders
              .filter((order) => order.task.task_id === expandedOrder)
              .map((order) => (
                <div key={order.task.task_id}>
                  <p>
                    <strong>Task ID:</strong> {order.task.task_id}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.taskDetails[0].taskStatus}
                  </p>
                  <p>
                    <strong>Payment:</strong> {order.paymentDetails[0].amount} ({order.paymentDetails[0].status})
                  </p>
                  <p>
                    <strong>Vehicle Type:</strong> {order.taskDetails[0].vehicleType}
                  </p>
                  <p>
                    <strong>Source:</strong> {order.taskDetails[0].pickupLocation}
                  </p>
                  <p>
                    <strong>Destination:</strong> {order.taskDetails[0].dropLocation}
                  </p>
                  <p>
                    <strong>Item Description:</strong> {order.taskDetails[0].itemDescription}
                  </p>
                </div>
              ))}
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
