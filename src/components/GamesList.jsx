import React, { useState } from "react";
import "./GamesList.css";

const GAMES = [
  { id: 1, name: "Knowledge Flip", url: "https://knowledge-flip.vercel.app/", category: "Card Memory" },
  { id: 2, name: "Eco Maze", url: "https://eco-maze.vercel.app/", category: "Strategy Puzzle" },
  { id: 3, name: "Water Leak", url: "https://water-leak-sigma.vercel.app/", category: "Conservation" },
  { id: 4, name: "Clean Beach", url: "https://cleanbeach-khaki.vercel.app/", category: "Cleanup Action" },
];

export default function GamesList({ onActivityUpdate }) {
  const [activeGame, setActiveGame] = useState(null);
  const [enteredScore, setEnteredScore] = useState(50);
  const [statusMsg, setStatusMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getAuth = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token") || "";
      const userId = user._id || user.id;
      return { user, token, userId };
    } catch {
      return { user: null, token: "", userId: null };
    }
  };

  const handlePlay = async (game) => {
    // Open the external deployed game in a new tab
    window.open(game.url, "_blank");

    // Automatically record game start (+15 points for exploring)
    const { token, userId } = getAuth();
    if (userId) {
      try {
        await fetch(`http://localhost:5000/api/users/${userId}/updateScore`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            gameName: game.name,
            points: 15,
            score: 20,
            badge: "Game Explorer",
          }),
        });
        if (onActivityUpdate) onActivityUpdate();
      } catch (err) {
        console.error("Error logging game start:", err);
      }
    }

    // Open score confirmation popup
    setActiveGame(game);
    setEnteredScore(50);
    setStatusMsg("");
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (!activeGame) return;

    setSubmitting(true);
    const { token, userId } = getAuth();

    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId || "me"}/updateScore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameName: activeGame.name,
          score: Number(enteredScore) || 50,
          points: 25,
          badge: "Eco Gamer",
        }),
      });

      if (res.ok) {
        setStatusMsg(`🎉 Score of ${enteredScore} saved! +25 EcoPoints added!`);
        if (onActivityUpdate) onActivityUpdate();
        setTimeout(() => {
          setActiveGame(null);
          setStatusMsg("");
        }, 1600);
      } else {
        setStatusMsg("Failed to save score. Please try again.");
      }
    } catch (err) {
      console.error("Error saving score:", err);
      setStatusMsg("Error connecting to server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="games-section">
      <div className="games-row">
        {GAMES.map((game) => (
          <div key={game.id} className="game-card">
            <div className="game-badge">{game.category}</div>
            <div className="game-name">{game.name}</div>
            <p className="game-desc">Play to earn +15 to +40 EcoPoints!</p>
            <button className="game-btn" onClick={() => handlePlay(game)}>
              🎮 Play Now
            </button>
          </div>
        ))}
      </div>

      {/* Score Submission Modal */}
      {activeGame && (
        <div className="game-modal-backdrop" onClick={() => setActiveGame(null)}>
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🌿 {activeGame.name}</h3>
              <button className="close-btn" onClick={() => setActiveGame(null)}>
                ✕
              </button>
            </div>
            <p className="modal-desc">
              Your game opened in a new tab! Once you finish playing, submit your score below to claim bonus EcoPoints and climb the Leaderboard:
            </p>

            <form onSubmit={handleSubmitScore} className="score-form">
              <label htmlFor="gameScore">Your Game Score:</label>
              <input
                id="gameScore"
                type="number"
                min="0"
                max="10000"
                value={enteredScore}
                onChange={(e) => setEnteredScore(e.target.value)}
                className="score-input"
                required
              />

              <div className="modal-actions">
                <button type="submit" className="claim-btn" disabled={submitting}>
                  {submitting ? "Saving..." : "🏆 Claim Bonus (+25 pts)"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setActiveGame(null)}
                >
                  Done
                </button>
              </div>

              {statusMsg && <div className="score-status">{statusMsg}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
