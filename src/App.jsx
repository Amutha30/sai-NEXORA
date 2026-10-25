import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import StaffDashboard from "./components/StaffDashboard";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.role === "staff") navigate("/staff-dashboard");
    else navigate("/dashboard");
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.role === "staff") navigate("/staff-dashboard");
    else navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate
                to={user.role === "staff" ? "/staff-dashboard" : "/dashboard"}
                replace
              />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate
                to={user.role === "staff" ? "/staff-dashboard" : "/dashboard"}
                replace
              />
            ) : (
              <Signup onSignup={handleSignup} />
            )
          }
        />

        {/* Student Dashboard - Protected for Student role only */}
        <Route
          path="/dashboard"
          element={
            !user ? (
              <Navigate to="/" replace />
            ) : user.role === "staff" ? (
              <Navigate to="/staff-dashboard" replace />
            ) : (
              <Dashboard user={user} onLogout={handleLogout} />
            )
          }
        />

        {/* Staff Dashboard - Protected for Staff role only */}
        <Route
          path="/staff-dashboard"
          element={
            !user ? (
              <Navigate to="/" replace />
            ) : user.role !== "staff" ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <StaffDashboard user={user} onLogout={handleLogout} />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
