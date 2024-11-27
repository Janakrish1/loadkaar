import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Employer_HomePage from "./pages/Employer_HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentCheckout from "./pages/PaymentCheckout";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Protecting /employer-home route */}
                <Route
                    path="/employer-home"
                    element={<ProtectedRoute element={<Employer_HomePage />} />}
                />
                <Route
                    path="/payment"
                    element={<PaymentCheckout />}
                />

            </Routes>
        </Router>
    );
}

export default App;
