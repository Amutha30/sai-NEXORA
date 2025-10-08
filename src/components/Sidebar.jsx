import React from "react";
import {
  FaHome,
  FaGamepad,
  FaVideo,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
  FaLeaf,
} from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar({ collapsed, onToggle, onSelect, onLogout }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* App brand */}
      <div className="sidebar-brand">
        <FaLeaf className="brand-icon" />
        {!collapsed && <span className="brand-text">NEXORA</span>}
      </div>

      {/* Toggle */}
      <button className="toggle-btn" onClick={onToggle}>
        <FaBars />
      </button>

      {/* Menu */}
      <nav className="menu">
        <div className="menu-item" onClick={() => onSelect("home")}>
          <FaHome className="menu-icon" />
          {!collapsed && <span className="menu-label">Home</span>}
        </div>
        <div className="menu-item" onClick={() => onSelect("games")}>
          <FaGamepad className="menu-icon" />
          {!collapsed && <span className="menu-label">Games</span>}
        </div>
        <div className="menu-item" onClick={() => onSelect("videos")}>
          <FaVideo className="menu-icon" />
          {!collapsed && <span className="menu-label">Learning Videos</span>}
        </div>
        <div className="menu-item" onClick={() => onSelect("quizzes")}>
          <FaQuestionCircle className="menu-icon" />
          {!collapsed && <span className="menu-label">Quizzes</span>}
        </div>
        <div className="menu-item logout" onClick={onLogout}>
          <FaSignOutAlt className="menu-icon" />
          {!collapsed && <span className="menu-label">Logout</span>}
        </div>
      </nav>
    </div>
  );
}
