import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gameName: String,
  score: Number,
  date: { type: Date, default: Date.now },
  badgesEarned: [String],
  pointsEarned: Number,

  // ✅ Added fields for richer tracking
  duration: Number, // time spent in seconds or minutes
  levelReached: { type: Number, default: 1 }, // useful if your games have levels
  completed: { type: Boolean, default: false }, // whether the user finished the game
});

export default mongoose.model("GameSession", gameSessionSchema);
