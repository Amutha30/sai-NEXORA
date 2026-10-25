import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserGraduate,
  FaGamepad,
  FaQuestionCircle,
  FaLeaf,
  FaSignOutAlt,
  FaSearch,
  FaMedal,
  FaChartLine,
  FaSyncAlt,
  FaTimes,
  FaTrophy,
  FaCalendarAlt,
} from "react-icons/fa";
import "./StaffDashboard.css";

export default function StaffDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const navigate = useNavigate();

  // Fetch all registered students from backend MongoDB
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch("http://localhost:5000/api/users/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleLogout = () => {
    localStorage.clear();
    if (typeof onLogout === "function") onLogout();
    navigate("/");
  };

  // Filter students based on search input
  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q))
    );
  });

  // Calculate summary statistics
  const totalStudents = students.length;
  const totalPoints = students.reduce((acc, s) => acc + (s.points || 0), 0);
  const totalGames = students.reduce((acc, s) => acc + (s.gamesPlayed || 0), 0);
  const totalQuizzes = students.reduce((acc, s) => acc + (s.quizzesTaken || 0), 0);

  // Collect all game activities across all students
  const allGameLogs = students.flatMap((s) =>
    (s.gameHistory || []).map((g) => ({
      ...g,
      studentName: s.name,
      studentEmail: s.email,
    }))
  ).sort((a, b) => new Date(b.playedAt || 0) - new Date(a.playedAt || 0));

  // Collect all quiz activities across all students
  const allQuizLogs = students.flatMap((s) =>
    (s.quizHistory || []).map((q) => ({
      ...q,
      studentName: s.name,
      studentEmail: s.email,
    }))
  ).sort((a, b) => new Date(b.takenAt || 0) - new Date(a.takenAt || 0));

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="staff-layout">
      {/* Sidebar */}
      <aside className="staff-sidebar">
        <div className="staff-brand">
          <FaLeaf className="brand-logo" />
          <div className="brand-info">
            <span className="brand-name">NEXORA</span>
            <span className="brand-tag">Staff Portal</span>
          </div>
        </div>

        <nav className="staff-menu">
          <button
            className={`staff-menu-item ${activePage === "home" ? "active" : ""}`}
            onClick={() => setActivePage("home")}
          >
            <FaUserGraduate className="menu-icon" />
            <span>Students Overview</span>
          </button>

          <button
            className={`staff-menu-item ${activePage === "games" ? "active" : ""}`}
            onClick={() => setActivePage("games")}
          >
            <FaGamepad className="menu-icon" />
            <span>Game Logs ({allGameLogs.length})</span>
          </button>

          <button
            className={`staff-menu-item ${activePage === "quizzes" ? "active" : ""}`}
            onClick={() => setActivePage("quizzes")}
          >
            <FaQuestionCircle className="menu-icon" />
            <span>Quiz Logs ({allQuizLogs.length})</span>
          </button>
        </nav>

        <div className="staff-user-card">
          <div className="staff-avatar">
            {(user?.name || "Staff").charAt(0).toUpperCase()}
          </div>
          <div className="staff-details">
            <div className="staff-name">{user?.name || "Staff Member"}</div>
            <div className="staff-email">{user?.email || "staff@school.edu"}</div>
          </div>
          <button
            className="staff-logout-btn"
            onClick={handleLogout}
            title="Log Out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="staff-main-area">
        {/* Top Header */}
        <header className="staff-header">
          <div className="header-titles">
            <h1 className="header-title">
              {activePage === "home" && "Student Progress & Analytics"}
              {activePage === "games" && "All Student Game Sessions"}
              {activePage === "quizzes" && "All Student Quiz Records"}
            </h1>
            <p className="header-subtitle">
              Live data from MongoDB database • Last synced:{" "}
              {lastRefreshed.toLocaleTimeString()}
            </p>
          </div>

          <div className="header-actions">
            <button
              className="refresh-btn"
              onClick={fetchStudents}
              disabled={loading}
              title="Refresh from MongoDB"
            >
              <FaSyncAlt className={loading ? "spin" : ""} />
              <span>{loading ? "Syncing..." : "Sync Data"}</span>
            </button>
            <button className="logout-top-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Tab 1: Students Overview (Home) */}
        {activePage === "home" && (
          <div className="staff-content-container">
            {/* 4 Summary Stat Cards */}
            <div className="stats-cards-grid">
              <div className="stat-card card-students">
                <div className="stat-icon-wrap">
                  <FaUserGraduate />
                </div>
                <div className="stat-data">
                  <span className="stat-number">{totalStudents}</span>
                  <span className="stat-label">Registered Students</span>
                </div>
              </div>

              <div className="stat-card card-points">
                <div className="stat-icon-wrap">
                  <FaLeaf />
                </div>
                <div className="stat-data">
                  <span className="stat-number">{totalPoints}</span>
                  <span className="stat-label">Total EcoPoints Earned</span>
                </div>
              </div>

              <div className="stat-card card-games">
                <div className="stat-icon-wrap">
                  <FaGamepad />
                </div>
                <div className="stat-data">
                  <span className="stat-number">{totalGames}</span>
                  <span className="stat-label">Games Completed</span>
                </div>
              </div>

              <div className="stat-card card-quizzes">
                <div className="stat-icon-wrap">
                  <FaQuestionCircle />
                </div>
                <div className="stat-data">
                  <span className="stat-number">{totalQuizzes}</span>
                  <span className="stat-label">Quizzes Completed</span>
                </div>
              </div>
            </div>

            {/* Student Directory Table Card */}
            <div className="panel-card">
              <div className="panel-header">
                <div>
                  <h2 className="panel-title">All Registered Students</h2>
                  <span className="panel-count">
                    Showing {filteredStudents.length} of {totalStudents} students
                  </span>
                </div>

                <div className="search-wrap">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by student name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      className="clear-search"
                      onClick={() => setSearchQuery("")}
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="loading-state">
                  <FaSyncAlt className="spin loading-icon" />
                  <p>Loading registered students from MongoDB...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="empty-state">
                  <p>No students found matching "{searchQuery}"</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>EcoPoints</th>
                        <th>Games</th>
                        <th>Quizzes</th>
                        <th>Earned Badges</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((st, idx) => (
                        <tr key={st._id || idx}>
                          <td>
                            <div className="student-cell">
                              <div className="student-avatar-circle">
                                {st.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="student-full-name">{st.name}</span>
                            </div>
                          </td>
                          <td className="email-cell">{st.email}</td>
                          <td>{st.age || "—"}</td>
                          <td>
                            <span className="points-badge">
                              <FaLeaf /> {st.points || 0} pts
                            </span>
                          </td>
                          <td>
                            <span className="count-pill games-pill">
                              {st.gamesPlayed || 0}
                            </span>
                          </td>
                          <td>
                            <span className="count-pill quiz-pill">
                              {st.quizzesTaken || 0}
                            </span>
                          </td>
                          <td>
                            <div className="badges-chip-row">
                              {(st.badges && st.badges.length > 0
                                ? st.badges
                                : ["Eco Starter"]
                              ).map((b, bIdx) => (
                                <span key={bIdx} className="staff-badge-chip">
                                  <FaMedal /> {b}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <button
                              className="view-logs-btn"
                              onClick={() => setSelectedStudent(st)}
                            >
                              <FaChartLine /> View Logs
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Game Activities Across All Students */}
        {activePage === "games" && (
          <div className="staff-content-container">
            <div className="panel-card">
              <h2 className="panel-title">🎮 Full Game Activity Log</h2>
              <p className="panel-desc">
                Real-time chronicle of all games completed by students on NEXORA.
              </p>

              {allGameLogs.length === 0 ? (
                <div className="empty-state">
                  <p>No game sessions recorded yet. Play a game to see it logged here!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Student Name</th>
                        <th>Student Email</th>
                        <th>Game Title</th>
                        <th>Game Score</th>
                        <th>Points Awarded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allGameLogs.map((log, i) => (
                        <tr key={i}>
                          <td>
                            <span className="date-cell">
                              <FaCalendarAlt /> {formatDate(log.playedAt)}
                            </span>
                          </td>
                          <td className="student-full-name">{log.studentName}</td>
                          <td className="email-cell">{log.studentEmail}</td>
                          <td>
                            <span className="game-tag">{log.gameName}</span>
                          </td>
                          <td className="score-number">{log.score || 0}</td>
                          <td>
                            <span className="points-badge">
                              +{log.pointsEarned || 25} pts
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Quiz Activities Across All Students */}
        {activePage === "quizzes" && (
          <div className="staff-content-container">
            <div className="panel-card">
              <h2 className="panel-title">📝 Full Quiz Activity Log</h2>
              <p className="panel-desc">
                Real-time chronicle of environmental exams and quiz submissions.
              </p>

              {allQuizLogs.length === 0 ? (
                <div className="empty-state">
                  <p>No quiz submissions recorded yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="staff-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Student Name</th>
                        <th>Student Email</th>
                        <th>Quiz Title</th>
                        <th>Score Achieved</th>
                        <th>Points Awarded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allQuizLogs.map((log, i) => (
                        <tr key={i}>
                          <td>
                            <span className="date-cell">
                              <FaCalendarAlt /> {formatDate(log.takenAt)}
                            </span>
                          </td>
                          <td className="student-full-name">{log.studentName}</td>
                          <td className="email-cell">{log.studentEmail}</td>
                          <td>
                            <span className="quiz-tag">{log.quizTitle}</span>
                          </td>
                          <td className="score-number">{log.score}%</td>
                          <td>
                            <span className="points-badge">
                              +{log.pointsEarned || 30} pts
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Detailed Student Activity Modal */}
      {selectedStudent && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="student-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="student-modal-header">
              <div className="modal-student-info">
                <div className="modal-avatar">
                  {selectedStudent.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="modal-title">{selectedStudent.name}</h2>
                  <p className="modal-email">
                    {selectedStudent.email} • Age {selectedStudent.age || "N/A"}
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedStudent(null)}
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Pill Row */}
            <div className="modal-stats-row">
              <div className="modal-stat-box">
                <span className="modal-stat-value">
                  {selectedStudent.points || 0}
                </span>
                <span className="modal-stat-label">EcoPoints</span>
              </div>
              <div className="modal-stat-box">
                <span className="modal-stat-value">
                  {selectedStudent.gamesPlayed || 0}
                </span>
                <span className="modal-stat-label">Games</span>
              </div>
              <div className="modal-stat-box">
                <span className="modal-stat-value">
                  {selectedStudent.quizzesTaken || 0}
                </span>
                <span className="modal-stat-label">Quizzes</span>
              </div>
              <div className="modal-stat-box">
                <span className="modal-stat-value">
                  {(selectedStudent.badges || []).length}
                </span>
                <span className="modal-stat-label">Badges</span>
              </div>
            </div>

            {/* Badges Section */}
            <div className="modal-section">
              <h3>🏅 Earned Badges</h3>
              <div className="badges-chip-row">
                {(selectedStudent.badges || ["Eco Starter"]).map((b, idx) => (
                  <span key={idx} className="staff-badge-chip">
                    <FaMedal /> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Game Logs for this student */}
            <div className="modal-section">
              <h3>🎮 Game History</h3>
              {!selectedStudent.gameHistory || selectedStudent.gameHistory.length === 0 ? (
                <p className="text-muted">No individual games logged yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="staff-table mini-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Game</th>
                        <th>Score</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.gameHistory.map((g, idx) => (
                        <tr key={idx}>
                          <td>{formatDate(g.playedAt)}</td>
                          <td>{g.gameName}</td>
                          <td>{g.score}</td>
                          <td>+{g.pointsEarned} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quiz Logs for this student */}
            <div className="modal-section">
              <h3>📝 Quiz History</h3>
              {!selectedStudent.quizHistory || selectedStudent.quizHistory.length === 0 ? (
                <p className="text-muted">No individual quizzes logged yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="staff-table mini-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Quiz</th>
                        <th>Score</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.quizHistory.map((q, idx) => (
                        <tr key={idx}>
                          <td>{formatDate(q.takenAt)}</td>
                          <td>{q.quizTitle}</td>
                          <td>{q.score}%</td>
                          <td>+{q.pointsEarned} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-done"
                onClick={() => setSelectedStudent(null)}
              >
                Close Activity Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
