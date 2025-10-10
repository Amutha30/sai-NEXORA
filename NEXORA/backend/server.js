import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import userProgressRoutes from "./routes/userProgressRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", userProgressRoutes);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
