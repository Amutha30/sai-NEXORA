import React from "react";
import "./GamesList.css";

const GAMES = [
  { id: 1, name: "Knowledge Flip", url: "https://knowledge-flip.vercel.app/" },
  { id: 2, name: "Eco Maze", url: "https://eco-maze.vercel.app/" },
  { id: 3, name: "Water Leak", url: "https://water-leak-sigma.vercel.app/" },
  { id: 4, name: "Clean Beach", url: "https://cleanbeach-khaki.vercel.app/" },
];

export default function GamesList() {
  return (
    <div className="games-section">
      <h3 className="games-title"></h3>

      {/* horizontal row container */}
      <div className="games-row">
        {GAMES.map((game) => (
          <div key={game.id} className="game-card">
            <div className="game-name">{game.name}</div>
            <button
              className="game-btn"
              onClick={() => window.open(game.url, "_blank")}
            >
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
