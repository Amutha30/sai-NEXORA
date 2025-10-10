import express from "express";
const router = express.Router();

// Example route — get all games
router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Memory Match", category: "Puzzle" },
    { id: 2, name: "Math Quest", category: "Educational" },
  ]);
});

// Example route — get one game by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Details for game ID ${id}` });
});

export default router;
