import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import GamesList from "./GamesList";
import LearningVideosList from "./LearningVideosList";
import { SAMPLE_LEADERBOARD } from "../data";
import { FaLeaf, FaMedal, FaTrophy, FaAward } from "react-icons/fa";
import "./Dashboard.css";

export default function Dashboard({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const [leaderboard, setLeaderboard] = useState(SAMPLE_LEADERBOARD);
  const [userProfile, setUserProfile] = useState({
    name: "Eco Student",
    points: 0,
    gamesPlayed: 0,
    quizzesTaken: 0,
    badges: ["Eco Starter"],
  });

  // Quiz submission state
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizScore, setQuizScore] = useState(80);
  const [quizStatus, setQuizStatus] = useState("");
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // Fetch real data from backend
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token") || "";

      // 1. Fetch live Leaderboard
      const resLeaderboard = await fetch("http://localhost:5000/api/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resLeaderboard.ok) {
        const dataLeaderboard = await resLeaderboard.json();
        if (Array.isArray(dataLeaderboard) && dataLeaderboard.length > 0) {
          setLeaderboard(dataLeaderboard);
        }
      }

      // 2. Fetch live User Profile / Progress
      const resProfile = await fetch("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resProfile.ok) {
        const dataProfile = await resProfile.json();
        setUserProfile({
          name: dataProfile.name || "Eco Student",
          points: dataProfile.points || 0,
          gamesPlayed: dataProfile.gamesPlayed || 0,
          quizzesTaken: dataProfile.quizzesTaken || 0,
          badges: Array.isArray(dataProfile.badges) && dataProfile.badges.length > 0
            ? dataProfile.badges
            : ["Eco Starter"],
        });
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  // Quiz launcher & tracker
  const handleLaunchQuiz = async () => {
    window.open("https://quiz-lhzs.vercel.app/", "_blank");

    // Immediately record quiz play in MongoDB (+20 points)
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token") || "";
      const userId = user._id || user.id;

      if (userId) {
        await fetch(`http://localhost:5000/api/users/${userId}/updateScore`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quizTitle: "Eco Friendly Quiz",
            type: "quiz",
            points: 20,
            score: 75,
            badge: "Quiz Novice",
          }),
        });
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Error logging quiz launch:", err);
    }

    setShowQuizModal(true);
    setQuizStatus("");
    setQuizScore(80);
  };

  const handleQuizScoreSubmit = async (e) => {
    e.preventDefault();
    setQuizSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token") || "";
      const userId = user._id || user.id;

      const res = await fetch(`http://localhost:5000/api/users/${userId || "me"}/updateScore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizTitle: "Eco Friendly Quiz",
          type: "quiz",
          score: Number(quizScore) || 80,
          points: 30,
          badge: "Eco Scholar",
        }),
      });

      if (res.ok) {
        setQuizStatus(`🎉 Quiz score of ${quizScore}% saved! +30 EcoPoints added!`);
        fetchDashboardData();
        setTimeout(() => {
          setShowQuizModal(false);
          setQuizStatus("");
        }, 1600);
      } else {
        setQuizStatus("Could not save score. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting quiz score:", err);
      setQuizStatus("Error connecting to server.");
    } finally {
      setQuizSubmitting(false);
    }
  };

  const LeaderboardCard = () => (
    <div className="card wide-card leaderboard-card">
      <div className="card-header-row">
        <h3 className="card-title">
          <FaTrophy className="header-icon" /> Live Eco Leaderboard
        </h3>
        <span className="live-pill">Live MongoDB Sync</span>
      </div>
      <ul className="leaderboard-list">
        {leaderboard.map((p, i) => {
          const rankEmoji = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
          return (
            <li key={i} className={`leaderboard-entry ${i === 0 ? "top-rank" : ""}`}>
              <div className="student-info">
                <span className="rank-indicator">{rankEmoji}</span>
                <span className="student-name">{p.name}</span>
              </div>
              <span className="student-score">
                {p.score || p.ecopoints || 0} <FaLeaf className="eco-icon" /> EcoPoints
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const ActivityCard = () => {
    const gamesPercent = Math.min(100, Math.round((userProfile.gamesPlayed / 5) * 100));
    const quizzesPercent = Math.min(100, Math.round((userProfile.quizzesTaken / 5) * 100));
    const pointsPercent = Math.min(100, Math.round((userProfile.points / 250) * 100));

    return (
      <div className="card wide-card activity-card">
        <div className="card-header-row">
          <h3 className="card-title">
            <FaAward className="header-icon" /> Your Eco Activity & Stats
          </h3>
          <span className="points-pill">
            <FaLeaf /> {userProfile.points} EcoPoints
          </span>
        </div>

        {/* Progress Bars */}
        <div className="activity-item">
          <div className="activity-row">
            <span>🎮 Games Played ({userProfile.gamesPlayed} / 5 goal)</span>
            <span className="percent-text">{gamesPercent}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill games-fill" style={{ width: `${gamesPercent}%` }} />
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-row">
            <span>📝 Quizzes Completed ({userProfile.quizzesTaken} / 5 goal)</span>
            <span className="percent-text">{quizzesPercent}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill quiz-fill" style={{ width: `${quizzesPercent}%` }} />
          </div>
        </div>

        <div className="activity-item">
          <div className="activity-row">
            <span>🌟 Milestone Progress ({userProfile.points} / 250 pts)</span>
            <span className="percent-text">{pointsPercent}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill points-fill" style={{ width: `${pointsPercent}%` }} />
          </div>
        </div>

        {/* Badges Section */}
        <div className="badges-section">
          <h4>🏅 Badges Unlocked:</h4>
          <div className="badges-row">
            {userProfile.badges.map((b, idx) => (
              <span key={idx} className="badge-chip">
                <FaMedal className="badge-icon" /> {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case "games":
        return (
          <>
            <h1 className="dashboard-title">Eco Games Arena</h1>
            <p className="dashboard-subtitle">Play games to earn points, unlock badges, and save the planet!</p>
            <div className="games-row">
              <GamesList onActivityUpdate={fetchDashboardData} />
            </div>
          </>
        );
      case "videos":
        return (
          <>
            <h1 className="dashboard-title">Learning Videos</h1>
            <p className="dashboard-subtitle">Watch interactive videos to learn environmental stewardship.</p>
            <div className="centered-content">
              <LearningVideosList />
            </div>
          </>
        );
      case "quizzes":
        return (
          <>
            <h1 className="dashboard-title">Environmental Quizzes</h1>
            <p className="dashboard-subtitle">Test your eco knowledge and earn bonus EcoPoints!</p>
            <div className="centered-content">
              <div className="card wide-card quiz-card">
                <div className="quiz-banner">🌱 Official Eco Quiz</div>
                <h3 className="quiz-heading">Eco Friendly Challenge</h3>
                <p className="quiz-desc">
                  Take the online environmental quiz. Test your awareness about recycling, energy conservation, and sustainability.
                </p>
                <div className="quiz-reward-info">
                  <span>🏆 Earn +20 to +50 EcoPoints</span>
                  <span>🏅 Unlocks "Eco Scholar" Badge</span>
                </div>
                <button className="btn quiz-launch-btn" onClick={handleLaunchQuiz}>
                  🚀 Start Quiz Now
                </button>
              </div>
            </div>

            {/* Quiz Score Submission Modal */}
            {showQuizModal && (
              <div className="game-modal-backdrop" onClick={() => setShowQuizModal(false)}>
                <div className="game-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3>📝 Record Quiz Score</h3>
                    <button className="close-btn" onClick={() => setShowQuizModal(false)}>
                      ✕
                    </button>
                  </div>
                  <p className="modal-desc">
                    Your quiz opened in a new tab! When you finish, enter your score below to claim your bonus EcoPoints:
                  </p>
                  <form onSubmit={handleQuizScoreSubmit} className="score-form">
                    <label htmlFor="quizScoreInput">Quiz Score (% or correct answers):</label>
                    <input
                      id="quizScoreInput"
                      type="number"
                      min="0"
                      max="100"
                      value={quizScore}
                      onChange={(e) => setQuizScore(e.target.value)}
                      className="score-input"
                      required
                    />
                    <div className="modal-actions">
                      <button type="submit" className="claim-btn" disabled={quizSubmitting}>
                        {quizSubmitting ? "Saving..." : "🏆 Submit & Claim +30 pts"}
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setShowQuizModal(false)}
                      >
                        Done
                      </button>
                    </div>
                    {quizStatus && <div className="score-status">{quizStatus}</div>}
                  </form>
                </div>
              </div>
            )}
          </>
        );
      default:
        return (
          <>
            <h1 className="dashboard-title">Welcome to NEXORA, {userProfile.name}!</h1>
            <p className="dashboard-subtitle">Your personal environmental learning dashboard</p>
            <div className="stacked-content">
              <ActivityCard />
              <LeaderboardCard />
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
