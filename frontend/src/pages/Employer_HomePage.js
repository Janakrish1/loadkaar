import React, { useState } from "react";
import "../styles/Employer_HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg"
import { clearUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookDeliveryPartner from "./BookDeliveryPartner";

function Employer_HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentOrders, setcurrentOrders] = useState([]);
  const [showBookDeliveryPartner, setBookDeliveryPartner] = useState(false);

  const [currentView, setCurrentView] = useState("default");


  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/');
  };

  const handleDeliveryBooking = () => {
    setBookDeliveryPartner(true);
  };

  const handleWarehouseBooking = () => {

  };

  const handleClose = () => {
    setBookDeliveryPartner(false);
  }

  const handleFindDeliveryPartner = () => {
    handleClose();
    setCurrentView("findDelivery");
  };


  return (
    <div className="homepage-container">
      {/* Header Section */}
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="LoadKaar Logo" className="logo" />
        </div>
        <h1 className="website-name">LoadKaar</h1>
        <div className="profile-container">
          <div className="status active">ACTIVE</div>
          <div className="profile">
            <img src={profile_pic} alt="profile_pic" className="profile-icon" />
            <span>Profile</span>
          </div>
          {/* Logout Button */}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar Section */}
        <aside className="sidebar">
          <div className="menu-item">Past Orders</div>
          <div className="menu-item">Payments</div>
          <div className="menu-item">Tasks Review</div>

          <div className="rating">
            <h3>Rating</h3>
            <div className="stars">⭐⭐⭐⭐</div>
            <div>4.0</div>
          </div>
        </aside>

        {/* Main Content Section */}
        <main className="main-content">
          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleDeliveryBooking} className="theme-button">Book Delivery Partner</button>
            <button onClick={handleWarehouseBooking} className="theme-button">Book Warehouse</button>
          </div>

          {currentView === "default" && (
            <div>

              <br />

              {/* Current Orders Section */}
              <div>
                {currentOrders == null ? (
                  <></> // Placeholder for when there are no orders
                ) : (
                  <h1>No Current Orders!</h1>
                )}
              </div>
            </div>
          )}

          {
            currentView === "findDelivery" && (
              <></>
            )
          }

        </main>


        {showBookDeliveryPartner && <BookDeliveryPartner onFindDeliveryPartner={handleFindDeliveryPartner} onClose={handleClose} />
        }
      </div>


      {/* Footer Section */}
      <footer className="footer">
        <span> 2024 LoadKaar @ All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Employer_HomePage;
