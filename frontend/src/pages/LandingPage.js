import React, { useState } from 'react';
import '../styles/LandingPage.css'; // Import the CSS for styling
import logo from '../assets/logo.jpeg';
import Login from './Login.js';
import validation from '../middleware/signupValidation.js';
import axios from 'axios';

function LandingPage() {
    const [category, setCategory] = useState(null);
    const [showLoginPopup, setLoginPopup] = useState(false);

    const handleLoginPopup = (event) => {
        setCategory(event.target.value);
        setLoginPopup(true);
    };

    const closeLoginPopup = () => {
        setLoginPopup(false);
    };


    return (
        <div>
            <div className="landing-container">
            <header className="header">
                    <img src={logo} alt="LoadKaar Logo" className="logo" />
                    <h1 className="website-name">LoadKaar</h1>
                </header>

                <main>
                    <div className="hero-section">
                        <h1>Connecting Workforce, Driving Progress</h1>
                    </div>

                    <div className="services">
                        <div className="service-box">
                            <h2>User Account</h2>
                            <button value="Employer" onClick={handleLoginPopup} className="sign-up-button">Sign Up</button>
                        </div>
                        <div className="service-box">
                            <h2>Service Provider</h2>
                            <button value="Employee" onClick={handleLoginPopup} className="sign-up-button">Sign Up</button>
                        </div>
                        <div className="service-box">
                            <h2>Warehouse Rentals</h2>
                            <button value="Owner" onClick={handleLoginPopup} className="sign-up-button">Sign Up</button>
                        </div>
                    </div>

                    <div className="about-section">
                        <h3>About LoadKaar</h3>
                        <p>
                            LoadKaar is a revolutionary platform that transforms unorganised labour into a streamlined workforce for India's on-demand services industry.
                            By connecting rickshaw pullers, auto drivers, and vehicle operators of all sizes with businesses in need, LoadKaar facilitates profitable, efficient, and on-demand employment solutions.
                        </p>
                    </div>
                </main>
            </div>
            {showLoginPopup && (
                <Login category={category} onClose={closeLoginPopup} />
            )}
            <div className="footer">
                <span>&copy; 2024 LoadKaar. All rights reserved.</span>
            </div>
        </div>
    );
}

export default LandingPage;
