import React, { useState } from "react";
import "../styles/Register.css"; // Dedicated styles for the register form
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

function Register({ role, onClose }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        houseNo: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: role
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRegister = (event) => {
        event.preventDefault();

        const userData = {
          email: formData.email,
          password: formData.password,
          role: role
        };

        axios.post("http://localhost:5001/api/register", formData)
        .then(res => {
            dispatch(setUser(userData));
            navigate('/home');
        })
        .catch (error => alert(error.response?.data?.error || "An error occurred during login."));
    };

    return (
        <div className="popup-overlay">
            <div className="register-popup">
                <h2>Register</h2>
                <div className="form-container">
                    <form onSubmit={handleRegister}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>House No.:</label>
                                <input
                                    type="text"
                                    name="houseNo"
                                    value={formData.houseNo}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Locality:</label>
                                <input
                                    type="text"
                                    name="locality"
                                    value={formData.locality}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>City:</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>State:</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode:</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="register-button">Register</button>
                            <button onClick={onClose} type="button" className="close-button">
                                Back
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;