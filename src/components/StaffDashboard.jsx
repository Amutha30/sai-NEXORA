import React, { useEffect, useRef, useState } from "react";
import "./StaffDashboard.css";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sidebarRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const mentees = [
    { id: "m1", name: "Aarav", email: "aarav@school.com", points: 120 },
    { id: "m2", name: "Diya", email: "diya@school.com", points: 95 },
    { id: "m3", name: "Rohan", email: "rohan@school.com", points: 150 },
  ];

  const gameStats = [
    { name: "Aarav", game: "Eco Maze", points: 45 },
    { name: "Diya", game: "Knowledge Flip", points: 30 },
    { name: "Rohan", game: "Water Leak", points: 60 },
  ];

  const videoStats = [
    { name: "Aarav", video: "Recycling 101", time: "15 min" },
    { name: "Diya", video: "Saving Trees", time: "10 min" },
    { name: "Rohan", video: "Wildlife Wonders", time: "25 min" },
  ];

  const quizStats = [
    { name: "Aarav", quiz: "Eco Quiz 1", score: 8 },
    { name: "Diya", quiz: "Eco Quiz 2", score: 6 },
    { name: "Rohan", quiz: "Eco Quiz 1", score: 9 },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        drawerOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setDrawerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen]);

  const onNavClick = (page) => {
    setActivePage(page);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    if (typeof onLogout === "function") onLogout();
    navigate("/");
  };

  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <div className="content-card">
            <h2>Your Mentees List</h2>
            <label className="field-label">Select mentee</label>
            <div className="dropdown-wrap">
              <select className="mentee-dropdown">
                <option value="">— Select a mentee —</option>
                {mentees.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.email} ({m.points} pts)
                  </option>
                ))}
              </select>
            </div>
            <div className="card-small-grid">
              {mentees.map((m) => (
                <div key={m.id} className="mentee-card">
                  <div className="mentee-name">{m.name}</div>
                  <div className="mentee-meta">{m.email}</div>
                  <div className="mentee-points">{m.points} pts</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "games":
        return (
          <div className="content-card">
            <h2>Games Overview</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Game</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {gameStats.map((g, i) => (
                  <tr key={i}>
                    <td>{g.name}</td>
                    <td>{g.game}</td>
                    <td>{g.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "videos":
        return (
          <div className="content-card">
            <h2>Learning Videos Progress</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Video</th>
                  <th>Time Spent</th>
                </tr>
              </thead>
              <tbody>
                {videoStats.map((v, i) => (
                  <tr key={i}>
                    <td>{v.name}</td>
                    <td>{v.video}</td>
                    <td>{v.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "quizzes":
        return (
          <div className="content-card">
            <h2>Quiz Results</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Quiz</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {quizStats.map((q, i) => (
                  <tr key={i}>
                    <td>{q.name}</td>
                    <td>{q.quiz}</td>
                    <td>{q.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="staff-dashboard-root" ref={containerRef}>
      <header className="topbar">
        <button
          aria-label="Menu"
          className={`hamburger ${drawerOpen ? "open" : ""}`}
          onClick={() => setDrawerOpen((s) => !s)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="topbar-title">NEXORA</div>
        <button className="logout-ghost" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <aside
        ref={sidebarRef}
        className={`sidebar below-topbar ${drawerOpen ? "open" : ""}`}
      >
        <nav className="sidebar-nav">
          <ul>
            <li
              className={activePage === "home" ? "active" : ""}
              onClick={() => onNavClick("home")}
            >
              Home
            </li>
            <li
              className={activePage === "games" ? "active" : ""}
              onClick={() => onNavClick("games")}
            >
              Games
            </li>
            <li
              className={activePage === "videos" ? "active" : ""}
              onClick={() => onNavClick("videos")}
            >
              Learning Videos
            </li>
            <li
              className={activePage === "quizzes" ? "active" : ""}
              onClick={() => onNavClick("quizzes")}
            >
              Quizzes
            </li>
            <li onClick={handleLogout}>Logout</li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <small>Signed in as</small>
          <div>{user?.email}</div>
        </div>
      </aside>

      <main className="dashboard-main">{renderPage()}</main>
    </div>
  );
}
