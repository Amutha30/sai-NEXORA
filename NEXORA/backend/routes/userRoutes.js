import express from "express";
import {
  getAllStudentsProgress,
  getLeaderboard,
  getUserProgress,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all registered students progress (for staff portal)
router.get("/students", getAllStudentsProgress);

// GET leaderboard & individual user progress
router.get("/leaderboard", protect, getLeaderboard);
router.get("/:id/progress", protect, getUserProgress);

export default router;