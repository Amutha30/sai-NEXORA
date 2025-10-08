import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('kid_user')) || null; }
    catch(e){ return null; }
  });

  useEffect(() => {
    localStorage.setItem('kid_user', JSON.stringify(user));
  }, [user]);

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />
        <Route path="/signup" element={<Signup onSignup={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} onLogout={() => setUser(null)} />} />
      </Routes>
    </div>
  );
}

export default App;
