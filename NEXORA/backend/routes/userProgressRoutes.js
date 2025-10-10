import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Fetch user progress
router.get("/:id/progress", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("gamesPlayed quizzesTaken");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      points: user.points,
      badges: user.badges,
      gamesPlayed: user.gamesPlayed,
      quizzesTaken: user.quizzesTaken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user score/badges
router.post("/:id/updateScore", protect, async (req, res) => {
  const { points, badge } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.points += points;
    if (badge && !user.badges.includes(badge)) user.badges.push(badge);

    await user.save();
    res.json({ message: "Score updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
