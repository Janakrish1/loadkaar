import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Service_HomePage from "./pages/Service_HomePage";
import ProfileSettings from "./pages/Profile_Settings";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProfileSettings />} />
            </Routes>
        </Router>
    );
}

export default App;
