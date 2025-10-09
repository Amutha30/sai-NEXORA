import React from "react";
import "./GamesList.css";

const GAMES = [
  { id: 1, name: "Knowledge Flip", url: "https://knowledge-flip.vercel.app/" },
  { id: 2, name: "Eco Maze", url: "https://eco-maze.vercel.app/" },
  { id: 3, name: "Water Leak", url: "https://water-leak-sigma.vercel.app/" },
  { id: 4, name: "Clean Beach", url: "https://cleanbeach-khaki.vercel.app/" },
];

export default function GamesList() {
  const handlePlay = async (game) => {
    // open the game in new tab
    window.open(game.url, "_blank");

    // ✅ send update to backend for points/badge
    try {
      const user = JSON.parse(localStorage.getItem("user")); // stored from login
      const token = localStorage.getItem("token");
      if (!user || !token) return;

      await fetch(`http://localhost:5000/api/users/${user._id}/updateScore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          points: 10, 
          badge: "Game Starter", 
          gameName: game.name 
        }),
      });
      console.log("User score updated successfully!");
    } catch (err) {
      console.error("Error updating user score:", err);
    }
  };

  return (
    <div className="games-section">
      <h3 className="games-title"></h3>

      <div className="games-row">
        {GAMES.map((game) => (
          <div key={game.id} className="game-card">
            <div className="game-name">{game.name}</div>
            <button className="game-btn" onClick={() => handlePlay(game)}>
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
