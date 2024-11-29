import React, { useState } from "react";
import "../styles/EmployerOrders.css"; // CSS for TaskReview component

const EmployerOrders = ({ enrichedOrders }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null); // Temporarily holds order data while editing

  const handleExpand = (id) => {
    const currentOrder = enrichedOrders.find((order) => order.task.task_id === id);
    setExpandedOrder(id);
    setEditOrder({ ...currentOrder });
  };

  const handleInputChange = (field, value) => {
    setEditOrder((prev) => ({
      ...prev,
      taskDetails: [{ ...prev.taskDetails[0], [field]: value }],
    }));
  };

  const handleSave = () => {
    // Logic to save the edited order details (update state or API call)
    setExpandedOrder(null);
    setEditOrder(null);
  };

  const handleCancel = () => {
    setExpandedOrder(null);
    setEditOrder(null);
  };

  return (
    <div className="task-review-container">
      {enrichedOrders.map((order) => (
        <div
          key={order.task.task_id}
          className={`review-card ${expandedOrder === order.task.task_id ? "expanded" : ""}`}
          onClick={() => handleExpand(order.task.task_id)}
        >
          <h3>Task ID: {order.task.task_id}</h3>
          <p>Status: {order.taskDetails[0].taskStatus}</p>
          <p>Payment: {order.paymentDetails[0].amount} ({order.paymentDetails[0].status})</p>
          <p>Vehicle Type: {order.taskDetails[0].vehicleType}</p>
        </div>
      ))}

      {/* Popup for Expanded Order */}
      {expandedOrder && editOrder && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Edit Task Details</h3>
            <label>
              Pickup Location:
              <input
                type="text"
                value={editOrder.taskDetails[0].pickupLocation}
                onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
              />
            </label>
            <label>
              Drop Location:
              <input
                type="text"
                value={editOrder.taskDetails[0].dropLocation}
                onChange={(e) => handleInputChange("dropLocation", e.target.value)}
              />
            </label>
            <label>
              Task Status:
              <input
                type="text"
                value={editOrder.taskDetails[0].taskStatus}
                onChange={(e) => handleInputChange("taskStatus", e.target.value)}
              />
            </label>
            <div className="button-group">
              <button onClick={handleSave} className="save-button">
                Save
              </button>
              <button onClick={handleCancel} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerOrders;
