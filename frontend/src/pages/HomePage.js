import React from "react";
import "../styles/HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/userSlice";

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/');
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
        <img src={profile_pic} alt="profile_pic" className="profile-icon"/>
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
          <div className="menu-item">Vehicles</div>
          <div className="menu-item">Current Tasks</div>
          <div className="menu-item">Past Tasks</div>
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

export default HomePage;
