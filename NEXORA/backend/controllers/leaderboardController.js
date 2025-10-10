import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";

export const getLeaderboard = async (req, res) => {
  const data = await Leaderboard.find().populate("user", "name points");
  res.json(data.sort((a, b) => b.totalPoints - a.totalPoints));
};
