import GameSession from "../models/GameSession.js";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";

export const recordGame = async (req, res) => {
  const { gameName, score, pointsEarned, badgesEarned } = req.body;
  const session = await GameSession.create({
    user: req.user,
    gameName,
    score,
    pointsEarned,
    badgesEarned,
  });

  const user = await User.findById(req.user);
  user.points += pointsEarned;
  await user.save();

  await Leaderboard.findOneAndUpdate(
    { user: req.user },
    { totalPoints: user.points, lastUpdated: Date.now() },
    { upsert: true }
  );

  res.json({ message: "Game recorded", session });
};
