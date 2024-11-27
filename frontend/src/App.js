import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Employer_HomePage from "./pages/Employee_HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Vehicles from "./pages/Vehicles"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Protecting /home route */}
                <Route
                    path="/home"
                    element={<ProtectedRoute element={<Employer_HomePage />} />} 
                />
                <Route
                    path="/vehicles"
                    element={<ProtectedRoute element={<Vehicles />} />} 
                />

            </Routes>
        </Router>
    );
}

export default App;
