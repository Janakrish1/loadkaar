import React, { useState } from "react";
import '../styles/Login.css'; // Add CSS for styling the popup
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Login({ category, onClose }) {
    const [userData, setUserData] = useState({email: "", password: "", category: category});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogin = (event) => {
        event.preventDefault(); // Prevents default form submission behavior
        if (userData.email && userData.password) {
            dispatch(setUser(userData)); // Updates Redux state
            navigate('/home'); // Redirects to /home
        } else {
            alert("Please fill in both fields!");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{category} Login</h2>
                <form>
                    <label>
                        email:
                        <input type="text" name="email" value={userData.email}
                            onChange={handleInputChange}
                            required />
                    </label>
                    <label>
                        Password:
                        <input  type="password" name="password" value={userData.password}
                            onChange={handleInputChange}
                            required />
                    </label>
                    <button onClick={handleLogin} type="submit">Login</button>
                    <button onClick={handleLogin} type="submit">Register</button>
                </form>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
}

export default Login;
