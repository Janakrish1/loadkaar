import React, { useState } from "react";
import "../styles/Login.css"; // Add CSS for styling the popup
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Register from "./Register";
import axios from "axios";

function Login({ role, onClose }) {
    const [userData, setUserData] = useState({ email: "", password: "", role: role });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showRegisterPopup, setShowRegisterPopup] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        if (userData.email && userData.password) {
            try {
                // Send a POST request to validate the login
                const response = await axios.post("http://localhost:5001/api/login", {
                    email: userData.email,
                    password: userData.password,
                    role: userData.role,
                });

                // Check if login is successful
                if (response.data.message === "Login successful") {
                    // Dispatch the user data to Redux state
                    dispatch(setUser(userData));

                    // Navigate to the home page after login
                    navigate("/home");
                }
            } catch (error) {
                alert(error.response?.data?.error || "An error occurred during login.");
            }
        } else {
            alert("Please fill in both fields!");
        }
    };


    const openRegisterPopup = () => {
        setShowRegisterPopup(true);
    };

    const closeRegisterPopup = () => {
        setShowRegisterPopup(false);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{role} Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* <div className="form-buttons"> */}
                        <button type="submit" className="login-button">
                            Login
                        </button>
                        <button type="button" onClick={openRegisterPopup} className="register-button">
                            Register
                        </button>
                    {/* </div> */}
                </form>
                <button onClick={onClose} className="close-button">
                    Close
                </button>
            </div>
            {showRegisterPopup && <Register role={role} onClose={closeRegisterPopup} />}
        </div>
    );
}

export default Login;
