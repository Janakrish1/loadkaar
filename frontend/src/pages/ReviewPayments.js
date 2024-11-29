import React, { useState, useEffect } from "react";
import "../styles/TaskReview.css";
import axios from "axios";
import { useSelector } from "react-redux";

const ReviewPayments = () => {
  const { userID } = useSelector((state) => state.user); // Assuming userID is stored in the Redux state
  const [payments, setPayments] = useState([]);
  const [tasks, setTasks] = useState({}); // Store task_id for each payment
  const [expandedPayment, setExpandedPayment] = useState(null); // Tracks the currently expanded payment
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments from the backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:5001/api/get-payment-details", { user_id: userID });
        setPayments(response.data);

        // Fetch task IDs for each payment
        response.data.forEach((payment) => {
          fetchTaskByPaymentId(payment.payment_id);
        });

        setLoading(false);
      } catch (err) {
        setError("Error fetching payment details. Please try again later.");
        setLoading(false);
      }
    };

    if (userID) {
      fetchPayments();
    }
  }, [userID]);

  

  // Fetch task_id by payment_id
  const fetchTaskByPaymentId = async (payment_id) => {
    try {
      const response = await axios.post("http://localhost:5001/api/get-taskbypayment", { payment_id });
      setTasks((prevTasks) => ({
        ...prevTasks,
        [payment_id]: response.data.taskID,
      }));
    } catch (err) {
      console.error(`Error fetching task for payment ID ${payment_id}:`, err);
    }
  };

  const handleExpand = (payment) => {
    setExpandedPayment(payment); // Show the overlay with selected payment details
  };

  const handleCloseOverlay = () => {
    setExpandedPayment(null); // Hide the overlay
  };

  if (loading) {
    return <div className="loading">Loading payments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="task-review-container">
      {payments.map((payment) => (
        <div
          key={payment.payment_id}
          className="review-card"
          onClick={() => handleExpand(payment)}
        >
          <h3>Payment ID: {payment.payment_id}</h3>
          <p>Amount: ₹{payment.amount}</p>
          <p>Status: {payment.status}</p>
          <p>Payment Date: {new Date(payment.payment_date).toLocaleDateString()}</p>
          <p>Task ID: {tasks[payment.payment_id] || "Fetching..."}</p> {/* Display the task ID */}
        </div>
      ))}

      {/* Overlay Popup for Expanded Payment */}
      {expandedPayment && (
        <div className="popup-overlay" onClick={handleCloseOverlay}>
          <div
            className="popup-card"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            <h3>Payment Details</h3>
            <p><strong>Employer ID:</strong> {expandedPayment.employer_id}</p>
            <p><strong>Employee ID:</strong> {expandedPayment.employee_id}</p>
            <p><strong>Amount:</strong> ₹{expandedPayment.amount}</p>
            <p><strong>Status:</strong> {expandedPayment.status}</p>
            <p><strong>Payment ID:</strong>{expandedPayment.payment_id}</p>
            <p><strong>Payment Date:</strong> {new Date(expandedPayment.payment_date).toLocaleDateString()}</p>
            <p><strong>Task ID:</strong> {tasks[expandedPayment.payment_id] || "Fetching..."}</p>
            <div className="button-group">
              <button className="cancel-button" onClick={handleCloseOverlay}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPayments;

