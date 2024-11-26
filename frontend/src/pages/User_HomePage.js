import React from "react";
import "../styles/HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg"

function Service_HomePage() {
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
        <img src={profile_pic} alt="profile_pic" className="profile-icon"/>
      <span>Profile</span>
    </div>
  </div>
</header>

      {/* Main Layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar Section */}
        <aside className="sidebar">
          <div className="menu-item"></div>
          <div className="menu-item">Current Requested Orders</div>
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
          <h1>No Current Tasks!</h1>
        </main>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <span> 2024 LoadKaar @ All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Service_HomePage;
