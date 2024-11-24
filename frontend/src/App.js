import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Protecting /home route */}
                <Route
                    path="/home"
                    element={<ProtectedRoute element={<HomePage />} />} 
                />

            </Routes>
        </Router>
    );
}

export default App;
