import React from 'react';

export default function Topbar({ onToggleSidebar, onProfileClick, title = 'Welcome to Dashboard' }) {
  return (
    <div className="topbar">
      <div className="hamburger" onClick={onToggleSidebar}>☰</div>
      <div className="title-center">{title}</div>
      <div className="profile-btn" onClick={onProfileClick}>👧</div>
    </div>
  );
}
