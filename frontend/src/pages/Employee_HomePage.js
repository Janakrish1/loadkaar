import React, { useState } from "react";
import "../styles/Employee_HomePage.css"; // Import the CSS file
import logo from "../assets/logo.jpeg"; // Load your logo image here
import profile_pic from "../assets/Icons/profile.jpg"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/userSlice";

function Employee_HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage active/inactive status
  const [isActive, setIsActive] = useState(true); 
  const [vehiclesActive, setVehiclesActive] = useState(false); // Initially assume vehicles are not active

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/');
  };

  // Function to fetch vehicle active status from the database
  const fetchVehicleStatus = async () => {
    try {
      const response = await axios.get("/api/vehicles/status"); // Replace with your API endpoint
      setVehiclesActive(response.data.active); // Assuming the response contains a field `active`
    } catch (error) {
      console.error("Error fetching vehicle status:", error);
    }
  };

  // Fetch vehicle status on component mount
  useEffect(() => {
    fetchVehicleStatus();
  }, []);

  // Toggle active status
  const toggleStatus = () => {
   if (!isActive && !vehiclesActive) {
      // Redirect user to the "Vehicles" section if vehicles are inactive
      alert("Please activate your vehicles first.");
      navigate("/vehicles"); // Navigate to the Vehicles section
      return;
    }
    // Toggle active/inactive status
    setIsActive(!isActive);
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
            <div className={`status ${isActive ? 'active' : 'inactive'}`}>
              {isActive ? 'ACTIVE' : 'INACTIVE'}
            </div>
          </div>
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
        <div
            className="menu-item"
            onClick={() => navigate("/vehicles")} // Navigate to Vehicles
          >
            Vehicles
          </div>
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

export default Employee_HomePage;
