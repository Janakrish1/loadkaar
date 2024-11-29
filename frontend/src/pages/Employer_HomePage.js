import React, { useEffect, useState } from "react";
import "../styles/Employer_HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg";
import { clearUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookDeliveryPartner from "./BookDeliveryPartner";
import { clearDeliveryFormData, clearDeliveryPartnerView, setDeliveryPartnerView } from "../redux/deliveryPartnerViewSlice";
import FindDeliveryPartnerUsingMap from "./FindDeliveryPartnerUsingMap";
import axios from "axios";

function Employer_HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentOrders, setCurrentOrders] = useState(null);
  const [showBookDeliveryPartner, setBookDeliveryPartner] = useState(false);
  const { currentView, activeMenu } = useSelector((state) => state.deliveryPartnerView);
  const { userID } = useSelector((state) => (state.user));



  // Fetch user details when userID changes
  useEffect(() => {
    const fetchDetails = async () => {
        try {
            const response = await axios.post("http://localhost:5001/api/employer-get-tasks", {userID});
            console.log(response.data.results);
        } catch (err) {
            console.error("Error fetching details:", err);
        }
    };

    if (userID) {
        fetchDetails(userID);
    }
}, [userID]);


  // orders -> user_id 
  // payment - (payment_id) (user_id(employer_id)) (employee_id)

  // Handle Menu Click
  const handleMenuClick = (menuItem, view = "default") => {
    dispatch(setDeliveryPartnerView({ activeMenu: menuItem, currentView: view }));
    if(view === "default") {
      dispatch(clearDeliveryFormData());
    }
  };

  // Logout Functionality
  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(clearDeliveryPartnerView());
    navigate("/");
  };

  // Book Delivery Partner
  const handleDeliveryBooking = () => {
    setBookDeliveryPartner(true);
  };

  // Find Delivery Partner
  const handleFindDeliveryPartner = () => {
    setBookDeliveryPartner(false);
    handleMenuClick("", "findDelivery");
  };

  // Render View Based on State
  const renderView = () => {
    switch (currentView) {
      case "default": 
        return currentOrders !== null ? <></> : <div><br/><h1>No Current Orders!</h1></div>;
      case "findDelivery":
        return <FindDeliveryPartnerUsingMap />;
      default:
        return <div>Select a menu item to view details</div>;
    }
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
          <div className="profile">
            <img src={profile_pic} alt="profile_pic" className="profile-icon" />
            <span>Profile</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar Section */}
        <aside className="sidebar">
          <div
            className={`menu-item ${activeMenu === "Current Orders" ? "active" : ""}`}
            onClick={() => handleMenuClick("Current Orders")}
          >
            Current Orders
          </div>
          <div
            className={`menu-item ${activeMenu === "Past Orders" ? "active" : ""}`}
            onClick={() => handleMenuClick("Past Orders")}
          >
            Past Orders
          </div>
          <div
            className={`menu-item ${activeMenu === "Payments" ? "active" : ""}`}
            onClick={() => handleMenuClick("Payments")}
          >
            Payments
          </div>
          <div
            className={`menu-item ${activeMenu === "Tasks Review" ? "active" : ""}`}
            onClick={() => handleMenuClick("Tasks Review")}
          >
            Tasks Review
          </div>
        </aside>

        {/* Main Content Section */}
        <main className="main-content">
          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleDeliveryBooking} className="theme-button">Book Delivery Partner</button>
            <button className="theme-button">Book Warehouse</button>
          </div>

          {/* Dynamic View Rendering */}
          {renderView()}

          {/* Book Delivery Partner Component */}
          {showBookDeliveryPartner && (
            <BookDeliveryPartner
              onFindDeliveryPartner={handleFindDeliveryPartner}
              onClose={() => setBookDeliveryPartner(false)}
            />
          )}
        </main>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <span>2024 LoadKaar @ All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Employer_HomePage;
