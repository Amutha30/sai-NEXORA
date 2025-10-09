import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import GamesList from "./GamesList";
import LearningVideosList from "./LearningVideosList";
import { SAMPLE_LEADERBOARD, SAMPLE_TRACKING } from "../data";
import { FaLeaf } from "react-icons/fa";
import "./Dashboard.css";

export default function Dashboard({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // ✅ Added states for backend data
  const [leaderboard, setLeaderboard] = useState(SAMPLE_LEADERBOARD);
  const [tracking, setTracking] = useState(SAMPLE_TRACKING);

  // ✅ Fetch leaderboard + tracking data from backend when dashboard loads
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token"); // assuming login saves token
        const resLeaderboard = await fetch("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataLeaderboard = await resLeaderboard.json();
        setLeaderboard(dataLeaderboard);

        const resTracking = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataTracking = await resTracking.json();

        // transform backend user stats into progress bars format
        setTracking([
          { label: "Games Played", value: dataTracking.gamesPlayed || 0 },
          { label: "Badges Earned", value: dataTracking.badgesCount || 0 },
          { label: "Certificates", value: dataTracking.certificatesCount || 0 },
        ]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const LeaderboardCard = () => (
    <div className="card wide-card leaderboard-card">
      <h3 className="card-title">🌟 Leaderboard</h3>
      <ul className="leaderboard-list">
        {leaderboard.map((p, i) => (
          <li key={i} className="leaderboard-entry">
            <span className="student-name">{p.name}</span>
            <span className="student-score">
              {p.score} <FaLeaf className="eco-icon" /> {p.ecopoints}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  const ActivityCard = () => (
    <div className="card wide-card activity-card">
      <h3 className="card-title">📊 Your Activity</h3>
      {tracking.map((t, i) => (
        <div key={i} className="activity-item">
          <div className="activity-row">
            <span>{t.label}</span>
            <span>{t.value}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${t.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "games":
        return (
          <>
            <h1 className="dashboard-title">Available Games</h1>
            <div className="games-row">
              <GamesList />
            </div>
          </>
        );
      case "videos":
        return (
          <>
            <h1 className="dashboard-title">Learning Videos</h1>
            <div className="centered-content">
              <LearningVideosList />
            </div>
          </>
        );
      case "quizzes":
        return (
          <>
            <h1 className="dashboard-title">Available Exams</h1>
            <div className="centered-content">
              <div className="card wide-card">
                <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                  📝 Take your eco-friendly quiz!
                </p>
                <button
                  className="btn"
                  onClick={() =>
                    window.open("https://quiz-lhzs.vercel.app/", "_blank")
                  }
                >
                  Start Quiz
                </button>
              </div>
            </div>
          </>
        );
      default:
        return (
          <>
            <h1 className="dashboard-title">NEXORA</h1>
            <div className="stacked-content">
              <LeaderboardCard />
              <ActivityCard />
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleSidebar}
        onSelect={setActiveSection}
        onLogout={onLogout}
      />
      <div className="main-area">{renderMainContent()}</div>
    </div>
  );
}

