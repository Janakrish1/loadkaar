import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Employee_HomePage from "./pages/Employee_HomePage";
import Employer_HomePage from "./pages/Employer_HomePage";
import Warehouse_HomePage from "./pages/Employer_HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Vehicles from "./pages/Vehicles"

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Protecting /employer-home route */}
                <Route
                    path="/employee-home"
                    element={<ProtectedRoute element={<Employee_HomePage />} />} 
                />

                <Route
                    path="/employer-home"
                    element={<ProtectedRoute element={<Employer_HomePage />} />} 
                />

                <Route
                    path="/warehouse-home"
                    element={<ProtectedRoute element={<Employer_HomePage />} />} 
                />

            </Routes>
        </Router>
    );
}

export default App;
