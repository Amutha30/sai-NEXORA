import mongoose from "mongoose";
import User from "../models/User.js";
import GameSession from "../models/GameSession.js";

const isMongoConnected = () => mongoose.connection.readyState === 1;

// GET All Registered Students with Full Progress (For Staff Dashboard)
export const getAllStudentsProgress = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const students = await User.find({ role: "student" })
        .select("-password")
        .sort({ points: -1, createdAt: -1 });

      return res.json(students);
    }

    // Fallback data if offline
    res.json([
      {
        _id: "demo_1",
        name: "Alex Green",
        email: "alex@school.edu",
        age: 10,
        points: 130,
        gamesPlayed: 3,
        quizzesTaken: 2,
        badges: ["Eco Starter", "Game Explorer", "Eco Scholar"],
        gameHistory: [
          { gameName: "Eco Maze", score: 85, playedAt: new Date() },
          { gameName: "Knowledge Flip", score: 60, playedAt: new Date() },
        ],
        quizHistory: [
          { quizTitle: "Eco Friendly Challenge", score: 90, takenAt: new Date() },
        ],
      },
      {
        _id: "demo_2",
        name: "Emma Woods",
        email: "emma@school.edu",
        age: 11,
        points: 95,
        gamesPlayed: 2,
        quizzesTaken: 1,
        badges: ["Eco Starter", "Game Explorer"],
        gameHistory: [
          { gameName: "Water Leak", score: 70, playedAt: new Date() },
        ],
        quizHistory: [],
      },
    ]);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find({ role: "student" }).sort({ points: -1 }).limit(10);
      return res.json(users);
    }
    res.json([
      { name: "Alex Green", points: 450, badges: ["Eco Warrior", "Recycle Champ"] },
      { name: "Emma Woods", points: 390, badges: ["Tree Planter"] },
      { name: "Liam Rivers", points: 340, badges: ["Water Saver"] },
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const user = await User.findById(req.params.id);
      if (user) {
        const sessions = await GameSession.find({ user: req.params.id });
        const gamesPlayed = sessions.length || user.gamesPlayed || 0;
        const quizzesCompleted = user.quizzesTaken || 0;
        const challengesDone = (user.badges || []).length;

        return res.json({
          gamesPlayed,
          quizzesCompleted,
          challengesDone,
          points: user.points || 0,
          badges: user.badges || [],
          gameHistory: user.gameHistory || [],
          quizHistory: user.quizHistory || [],
        });
      }
    }

    res.json({
      gamesPlayed: 12,
      quizzesCompleted: 5,
      challengesDone: 4,
      points: 250,
      badges: ["Green Scout", "Eco Starter"],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
