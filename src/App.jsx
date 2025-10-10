import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import StaffDashboard from './components/StaffDashboard';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('kid_user', JSON.stringify(userData));
    if (userData.role === 'staff') navigate('/staff-dashboard');
    else navigate('/dashboard');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem('kid_user', JSON.stringify(userData));
    if (userData.role === 'staff') navigate('/staff-dashboard');
    else navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="/staff-dashboard" element={<StaffDashboard user={user} onLogout={handleLogout} />} />
      </Routes>
    </div>
  );
}

export default App;
