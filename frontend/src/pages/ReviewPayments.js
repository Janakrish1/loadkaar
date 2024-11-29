import React, { useState, useEffect } from "react";
import "../styles/TaskReview.css"; // CSS for TaskReview component
import axios from "axios";
import { useSelector } from "react-redux";

const ReviewPayments = () => {
  const { userID } = useSelector((state) => state.user); // Assuming userID is stored in the Redux state
  const [payments, setPayments] = useState([]);
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

  const handleExpand = (paymentId) => {
    setExpandedPayment((prev) => (prev === paymentId ? null : paymentId)); // Toggle expanded view
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
          className={`review-card ${expandedPayment === payment.payment_id ? "expanded" : ""}`}
          onClick={() => handleExpand(payment.payment_id)}
        >
          <h3>Payment ID: {payment.payment_id}</h3>
          <p>Amount: ₹{payment.amount}</p>
          <p>Status: {payment.status}</p>
          <p>Payment Date: {new Date(payment.payment_date).toLocaleDateString()}</p>

          {/* Expanded Payment Details View */}
          {expandedPayment === payment.payment_id && (
            <div className="expanded-details">
              <p><strong>Employer ID:</strong> {payment.employer_id}</p>
              <p><strong>Employee ID:</strong> {payment.employee_id}</p>
              <p><strong>Amount:</strong> ₹{payment.amount}</p>
              <p><strong>Status:</strong> {payment.status}</p>
              <p><strong>Payment Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}</p>
              <p><strong>Created At:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
              <p><strong>Updated At:</strong> {new Date(payment.updatedAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewPayments;
