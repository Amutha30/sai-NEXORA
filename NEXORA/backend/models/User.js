import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "staff"],
      default: "student",
    },
    age: {
      type: Number,
      required: function () {
        return this.role === "student";
      },
    },
    points: {
      type: Number,
      default: 50, // Welcome points
    },
    badges: {
      type: [String],
      default: ["Eco Starter"],
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    quizzesTaken: {
      type: Number,
      default: 0,
    },
    gameHistory: [
      {
        gameName: String,
        score: { type: Number, default: 0 },
        pointsEarned: { type: Number, default: 10 },
        playedAt: { type: Date, default: Date.now },
      },
    ],
    quizHistory: [
      {
        quizTitle: String,
        score: { type: Number, default: 0 },
        pointsEarned: { type: Number, default: 20 },
        takenAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
