
import express from "express";
import { getLeaderboard, getUserProgress } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/leaderboard", protect, getLeaderboard);
router.get("/:id/progress", protect, getUserProgress);

export default router; 