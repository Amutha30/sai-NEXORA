import User from "../models/User.js";

import GameSession from "../models/GameSession.js";

export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 }).limit(5);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const sessions = await GameSession.find({ user: req.params.id });

    const gamesPlayed = sessions.length;
    const quizzesCompleted = Math.floor(user.points / 10); // sample logic
    const challengesDone = user.badges.length;

    res.json({
      gamesPlayed,
      quizzesCompleted,
      challengesDone,
      points: user.points,
      badges: user.badges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
