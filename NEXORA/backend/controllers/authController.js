import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, role: user.role },
    process.env.JWT_SECRET || "nexora_secret_key_123",
    { expiresIn: "7d" }
  );
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback user store (active when MongoDB is offline)
const inMemoryUsers = [
  {
    id: "demo_student_1",
    _id: "demo_student_1",
    name: "Alex Green",
    email: "student@nexora.com",
    password: bcrypt.hashSync("password123", 10),
    role: "student",
    age: 10,
    points: 70,
    gamesPlayed: 2,
    quizzesTaken: 1,
    badges: ["Eco Starter", "Game Explorer"],
  },
  {
    id: "demo_staff_1",
    _id: "demo_staff_1",
    name: "Sarah Teacher",
    email: "staff@nexora.com",
    password: bcrypt.hashSync("password123", 10),
    role: "staff",
  },
];

// 🟢 SIGNUP Controller
export const signup = async (req, res) => {
  try {
    const { name, email, password, role, age } = req.body;
    const normalizedEmail = (email || "").toLowerCase().trim();

    // If MongoDB is connected, save to DB
    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role: role || "student",
        ...(role === "student" && { age }),
        points: 50,
        badges: ["Eco Starter"],
      });

      await newUser.save();
      const token = generateToken(newUser);

      return res.status(201).json({
        message: "Signup successful",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          age: newUser.age,
        },
      });
    }

    // Fallback in-memory store
    const existing = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = "mem_" + Date.now();
    const newUser = {
      id,
      _id: id,
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "student",
      ...(role === "student" && { age: Number(age) || 10 }),
      points: 50,
      badges: ["Eco Starter"],
      gamesPlayed: 0,
      quizzesTaken: 0,
    };
    inMemoryUsers.push(newUser);

    const token = generateToken(newUser);

    return res.status(201).json({
      message: "Signup successful (in-memory mode)",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        age: newUser.age,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// 🔵 LOGIN Controller with Strict Role Enforcement
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = (email || "").toLowerCase().trim();

    // If MongoDB is connected, authenticate via DB
    if (isMongoConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) return res.status(400).json({ message: "User not found with this email" });

      // Enforce separate login for student vs staff
      if (role && user.role !== role) {
        const requiredRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        return res.status(403).json({
          message: `Access denied: This account is registered as a ${user.role}. Please click the "${requiredRole}" button above to log in.`,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });

      const token = generateToken(user);
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age,
        },
      });
    }

    // Fallback in-memory store
    const user = inMemoryUsers.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(400).json({
        message: "User not found. Use student@nexora.com or staff@nexora.com (pwd: password123) or create a new account.",
      });
    }

    // Enforce separate login for student vs staff in memory fallback
    if (role && user.role !== role) {
      const requiredRole = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      return res.status(403).json({
        message: `Access denied: This account is registered as a ${user.role}. Please click the "${requiredRole}" button above to log in.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);
    return res.status(200).json({
      message: "Login successful (in-memory mode)",
      token,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
