import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

const isMongoConnected = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "nexora_secret_key_123");
        userId = decoded.id;
      } catch {
        // Token invalid or expired
      }
    }

    if (userId && isMongoConnected()) {
      const user = await User.findById(userId).select("-password");
      if (user) {
        return res.json({
          name: user.name,
          email: user.email,
          role: user.role,
          points: user.points || 0,
          gamesPlayed: user.gamesPlayed || 0,
          quizzesTaken: user.quizzesTaken || 0,
          badgesCount: (user.badges || []).length,
          badges: user.badges || [],
          certificatesCount: Math.floor((user.points || 0) / 100),
          gameHistory: user.gameHistory || [],
          quizHistory: user.quizHistory || [],
        });
      }
    }

    // Default fallback stats if not found or offline
    return res.json({
      name: "Eco Learner",
      points: 80,
      gamesPlayed: 3,
      quizzesTaken: 2,
      badgesCount: 2,
      badges: ["Eco Starter", "Game Explorer"],
      certificatesCount: 1,
      gameHistory: [],
      quizHistory: [],
    });
  } catch (err) {
    console.error("Profile route error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;
