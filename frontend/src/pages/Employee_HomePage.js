import React, { useState, useEffect } from "react";
import "../styles/Employee_HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/userSlice";
import axios from "axios";
import VehiclesPage from "./Vehicles"; // Import your VehiclesPage component

function Employee_HomePage() {
  const { userID } = useSelector((state) => state.user); // Using userID from Redux
  const dispatch = useDispatch();

  const [currentView, setCurrentView] = useState("default"); // Manage different views (default or vehicles)
  const [isActive, setIsActive] = useState(true); // State to manage active/inactive status
  const [vehiclesActive, setVehiclesActive] = useState(false); // Initially assume vehicles are not active

  // Logout function
  const handleLogout = () => {
    dispatch(clearUser());
    window.location.href = "/"; // Redirect to login page after logout
  };

  // Fetch vehicle status to check if it's active
  const fetchVehicleStatus = async () => {
    try {
      const vehicleDetails = {user_id: userID};
      const response = await axios.post("http://localhost:5001/api/vehicles/status", vehicleDetails);
      if (response.data.message === "User has at least one active vehicle.") {
        setVehiclesActive(true);
        setIsActive(true);
      } else {
        setVehiclesActive(false);
        setIsActive(false);
      }
      
    } catch (error) {
      setVehiclesActive(false);
      setIsActive(false);
      console.error("Error fetching vehicle status:", error);
    }
  };

// Check if any vehicle is active

  const updateToggleStatus = (vehiclesList) => {
  const hasActiveVehicle = vehiclesList.some((vehicle) => vehicle.status === "Active");
  setIsActive(hasActiveVehicle);
  };

  //Fetch vehicle status on component mount
  useEffect(() => {
    fetchVehicleStatus();
  }, [userID]);

  // Toggle active status
  const toggleStatus = async () => {
   if (!isActive) {
      alert("Please activate your vehicles first.");
      setCurrentView("vehicles");
      return;
    }
    setIsActive(!isActive);
  };

  // Function to load the "Vehicles" section in the same page
  const handleMenuClick = (view) => {
    if (view === "vehicles") {
      setCurrentView("vehicles");
    } else {
      setCurrentView("default");
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
          {/* Toggle Button for Active/Inactive */}
          <div className="status-toggle">
            <label className="switch">
              <input type="checkbox" checked={isActive} onChange={toggleStatus} />
              <span className="slider"></span>
            </label>
            <div className={`status ${isActive ? "active" : "inactive"}`}>
              {isActive ? "ACTIVE" : "INACTIVE"}
            </div>
          </div>
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
          <div className="menu-item" onClick={() => handleMenuClick("vehicles")}>
            Vehicles
          </div>
          <div className="menu-item" onClick={() => handleMenuClick("tasks")}>
            Current Tasks
          </div>
          <div className="menu-item" onClick={() => handleMenuClick("pastTasks")}>
            Past Tasks
          </div>
          <div className="menu-item" onClick={() => handleMenuClick("payments")}>
            Payments
          </div>
          <div className="menu-item" onClick={() => handleMenuClick("reviews")}>
            Your Reviews
          </div>
          <div className="menu-item" onClick={() => handleMenuClick("recreviews")}>
            Received Reviews
          </div>

          <div className="rating">
            <h3>Rating</h3>
            <div className="stars">⭐⭐⭐⭐</div>
            <div>4.0</div>
          </div>
        </aside>

        {/* Main Content Section */}
        <main className="main-content">
          {currentView === "default" && <h1>No Current Tasks!</h1>}
          {currentView === "vehicles" && (
            <VehiclesPage
              updateToggleStatus={updateToggleStatus}
            />
            )} {/* Display VehiclesPage here */}
          {currentView === "tasks" && <div>Current Tasks Section Here</div>}
          {currentView === "pastTasks" && <div>Past Tasks Section Here</div>}
          {currentView === "payments" && <div>Payments Section Here</div>}
          {currentView === "yreviews" && <div>Your Tasks Review Section Here</div>}
          {currentView === "recreviews" && <div>Received Tasks Review Section Here</div>}
        </main>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <span>2024 LoadKaar @ All rights reserved.</span>
      </footer>
    </div>
  );
}

export default Employee_HomePage;
