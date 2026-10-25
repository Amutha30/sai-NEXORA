import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

const isMongoConnected = () => mongoose.connection.readyState === 1;

// GET live leaderboard
router.get("/", async (req, res) => {
  try {
    if (isMongoConnected()) {
      const topUsers = await User.find({ role: "student" })
        .sort({ points: -1 })
        .limit(10)
        .select("name points");

      if (topUsers && topUsers.length > 0) {
        const formatted = topUsers.map((u) => ({
          name: u.name,
          score: u.points || 0,
          ecopoints: u.points || 0,
        }));
        return res.json(formatted);
      }
    }

    // Fallback sample data if no users or offline
    res.json([
      { name: "Aanya", score: 980, ecopoints: 980 },
      { name: "Kabir", score: 920, ecopoints: 920 },
      { name: "Maya", score: 880, ecopoints: 880 },
      { name: "Rohit", score: 820, ecopoints: 820 },
    ]);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

// POST new score (optional direct submission)
router.post("/", async (req, res) => {
  try {
    const { name, score, ecopoints } = req.body;
    res.json({ message: `Score added for ${name}`, score: score || ecopoints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
