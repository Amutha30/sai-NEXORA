import express from "express";
const router = express.Router();

// Example leaderboard route — get all scores
router.get("/", (req, res) => {
  res.json([
    { username: "Alice", score: 120 },
    { username: "Bob", score: 95 },
    { username: "Charlie", score: 80 },
  ]);
});

// Example route — add a new score
router.post("/", (req, res) => {
  const { username, score } = req.body;
  res.json({ message: `Score added for ${username}`, score });
});

export default router;
