import express from "express";
const router = express.Router();

// Example endpoint for fetching user profile
router.get("/", (req, res) => {
  res.json({ message: "Profile route working fine!" });
});

export default router;
