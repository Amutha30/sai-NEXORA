import express from "express";
const router = express.Router();

// Example test route
router.get("/", (req, res) => {
  res.json({ message: "Activity route working fine!" });
});

export default router;
