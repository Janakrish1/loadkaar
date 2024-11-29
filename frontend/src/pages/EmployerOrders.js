import React, { useState } from "react";
import "../styles/EmployerOrders.css"; // CSS for TaskReview component

const EmployerOrders = () => {
  const [reviews, setReviews] = useState([
    { id: 1, title: "Order #101", rating: 4, feedback: "Great service and timely delivery!" },
    { id: 2, title: "Order #102", rating: 3, feedback: "Average experience, slight delay." },
    { id: 3, title: "Order #103", rating: 5, feedback: "Exceptional service! Highly recommended!" },
    { id: 4, title: "Order #101", rating: 4, feedback: "Great service and timely delivery!" },
    { id: 5, title: "Order #102", rating: 3, feedback: "Average experience, slight delay." },
    { id: 6, title: "Order #103", rating: 5, feedback: "Exceptional service! Highly recommended!" },
    { id: 7, title: "Order #101", rating: 4, feedback: "Great service and timely delivery!" },
    { id: 8, title: "Order #102", rating: 3, feedback: "Average experience, slight delay." },
    { id: 9, title: "Order #103", rating: 5, feedback: "Exceptional service! Highly recommended!" },
    { id: 10, title: "Order #101", rating: 4, feedback: "Great service and timely delivery!" },
    { id: 11, title: "Order #102", rating: 3, feedback: "Average experience, slight delay." },
    { id: 12, title: "Order #103", rating: 5, feedback: "Exceptional service! Highly recommended!" }
  ]);

  const [expandedReview, setExpandedReview] = useState(null);
  const [editReview, setEditReview] = useState(null); // Temporarily holds review data while editing

  const handleExpand = (id) => {
    const currentReview = reviews.find((review) => review.id === id);
    setExpandedReview(id);
    setEditReview({ ...currentReview });
  };

  const handleInputChange = (field, value) => {
    setEditReview((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === expandedReview ? { ...editReview } : review
      )
    );
    setExpandedReview(null);
    setEditReview(null);
  };

  const handleCancel = () => {
    setExpandedReview(null);
    setEditReview(null);
  };

  return (
    <div className="task-review-container">
      {reviews.map((review) => (
        <div
          key={review.id}
          className={`review-card ${expandedReview === review.id ? "expanded" : ""}`}
          onClick={() => handleExpand(review.id)}
        >
          <h3>{review.title}</h3>
          <p>Rating: {review.rating}/5</p>
          <p>{review.feedback}</p>
        </div>
      ))}

      {/* Popup for Expanded Review */}
      {expandedReview && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Edit Review</h3>
            <label>
              Title:
              <input
                type="text"
                value={editReview.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </label>
            <label>
              Rating:
              <input
                type="number"
                value={editReview.rating}
                min="1"
                max="5"
                onChange={(e) => handleInputChange("rating", e.target.value)}
              />
            </label>
            <label>
              Feedback:
              <textarea
                value={editReview.feedback}
                onChange={(e) => handleInputChange("feedback", e.target.value)}
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