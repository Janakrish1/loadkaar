import React from 'react';
import '../styles/LandingPage.css'; // Import the CSS for styling
import logo from '../assets/logo.jpeg';

function LandingPage() {
    return (
        <div className="landing-container">
            <header className="navbar">
                <img src={logo} alt="LoadKaar Logo" className="logo" />
                <button className="sign-in-button">Sign In</button>
            </header>

            <main>
                <div className="hero-section">
                    <h1>"Connecting Workforce, Driving Progress"</h1>
                </div>

                <div className="services">
                    <div className="service-box">
                        <h2>User Account</h2>
                        <button className="sign-up-button">Sign Up</button>
                    </div>
                    <div className="service-box">
                        <h2>Service Provider</h2>
                        <button className="sign-up-button">Sign Up</button>
                    </div>
                    <div className="service-box">
                        <h2>Warehouse Rentals</h2>
                        <button className="sign-up-button">Sign Up</button>
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

            <footer>
                <p>&copy; 2024 LoadKaar @ All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
