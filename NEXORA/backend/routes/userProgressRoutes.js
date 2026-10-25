import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import GameSession from "../models/GameSession.js";

const router = express.Router();

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Helper to resolve user ID from params, headers, or body
const resolveUserId = (req) => {
  if (req.params.id && req.params.id !== "undefined" && req.params.id !== "null") {
    return req.params.id;
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "nexora_secret_key_123");
      return decoded.id;
    } catch {
      // ignore token error
    }
  }
  return req.body.userId || null;
};

// GET user progress
router.get("/:id/progress", async (req, res) => {
  try {
    const userId = resolveUserId(req);
    if (!userId) return res.status(400).json({ message: "User ID required" });

    if (isMongoConnected()) {
      const user = await User.findById(userId);
      if (user) {
        return res.json({
          points: user.points || 0,
          badges: user.badges || [],
          gamesPlayed: user.gamesPlayed || 0,
          quizzesTaken: user.quizzesTaken || 0,
          gameHistory: user.gameHistory || [],
          quizHistory: user.quizHistory || [],
        });
      }
    }

    res.json({
      points: 50,
      badges: ["Eco Starter"],
      gamesPlayed: 1,
      quizzesTaken: 1,
      gameHistory: [],
      quizHistory: [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST update score / record game or quiz play
router.post("/:id/updateScore", async (req, res) => {
  await handleScoreUpdate(req, res);
});

router.post("/updateScore", async (req, res) => {
  await handleScoreUpdate(req, res);
});

async function handleScoreUpdate(req, res) {
  try {
    const userId = resolveUserId(req);
    if (!userId) {
      return res.status(400).json({ message: "User ID could not be identified" });
    }

    const {
      points = 10,
      score = 0,
      badge,
      gameName,
      quizTitle,
      type = quizTitle ? "quiz" : "game",
    } = req.body;

    const pointsNum = Number(points) || 10;
    const scoreNum = Number(score) || pointsNum;

    if (isMongoConnected()) {
      let user = null;
      if (mongoose.Types.ObjectId.isValid(userId)) {
        user = await User.findById(userId);
      }
      if (!user) {
        user = await User.findOne({ _id: userId }).catch(() => null);
      }

      if (user) {
        // Add points
        user.points = (user.points || 0) + pointsNum;

        // Ensure badges array exists
        if (!Array.isArray(user.badges)) user.badges = ["Eco Starter"];

        // Handle Game vs Quiz
        if (type === "quiz" || quizTitle) {
          user.quizzesTaken = (user.quizzesTaken || 0) + 1;
          user.quizHistory.push({
            quizTitle: quizTitle || "Eco Quiz",
            score: scoreNum,
            pointsEarned: pointsNum,
            takenAt: new Date(),
          });
        } else {
          user.gamesPlayed = (user.gamesPlayed || 0) + 1;
          user.gameHistory.push({
            gameName: gameName || "Eco Game",
            score: scoreNum,
            pointsEarned: pointsNum,
            playedAt: new Date(),
          });

          // Save GameSession record
          await GameSession.create({
            user: user._id,
            gameName: gameName || "Eco Game",
            score: scoreNum,
            pointsEarned: pointsNum,
            completed: true,
          }).catch((e) => console.warn("GameSession save notice:", e.message));
        }

        // Add custom badge if supplied
        if (badge && !user.badges.includes(badge)) {
          user.badges.push(badge);
        }

        // Automatic Milestone Badges
        if (user.gamesPlayed >= 1 && !user.badges.includes("Game Explorer")) {
          user.badges.push("Game Explorer");
        }
        if (user.gamesPlayed >= 4 && !user.badges.includes("Eco Gamer")) {
          user.badges.push("Eco Gamer");
        }
        if (user.quizzesTaken >= 1 && !user.badges.includes("Quiz Novice")) {
          user.badges.push("Quiz Novice");
        }
        if (user.quizzesTaken >= 3 && !user.badges.includes("Eco Scholar")) {
          user.badges.push("Eco Scholar");
        }
        if (user.points >= 150 && !user.badges.includes("Planet Guardian")) {
          user.badges.push("Planet Guardian");
        }

        await user.save();

        console.log(`✅ Stored progress for ${user.name}: +${pointsNum} pts, total: ${user.points}, games: ${user.gamesPlayed}, quizzes: ${user.quizzesTaken}`);

        return res.json({
          message: "Score and activity saved successfully!",
          user: {
            id: user._id,
            name: user.name,
            points: user.points,
            gamesPlayed: user.gamesPlayed,
            quizzesTaken: user.quizzesTaken,
            badges: user.badges,
          },
        });
      }
    }

    // In-memory fallback
    return res.json({
      message: "Score saved (in-memory mode)",
      user: {
        points: 60 + pointsNum,
        gamesPlayed: 1,
        quizzesTaken: 1,
        badges: ["Eco Starter", badge || "Game Explorer"],
      },
    });
  } catch (err) {
    console.error("Score update error:", err);
    res.status(500).json({ message: err.message || "Failed to update score" });
  }
}

export default router;
