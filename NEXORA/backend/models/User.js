import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  points: { type: Number, default: 0 },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],

  // ✅ Added fields for tracking real user progress
  gamesPlayed: [{ type: mongoose.Schema.Types.ObjectId, ref: "GameSession" }],
  quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);
