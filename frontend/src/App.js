import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />

                {/* Protecting /home route */}
                <Route
                    path="/home"
                    element={<ProtectedRoute element={<HomePage />} />} 
                />

                {/* <Route path="/" element={<HomePage />} /> */}
                <Route path='/' element={<Login />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
