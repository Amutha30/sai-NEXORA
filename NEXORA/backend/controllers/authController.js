import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User exists" });
  const user = await User.create({ name, email, password });
  res.json({ token: jwt.sign({ id: user._id }, process.env.JWT_SECRET) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid password" });
  res.json({ token: jwt.sign({ id: user._id }, process.env.JWT_SECRET) });
};
