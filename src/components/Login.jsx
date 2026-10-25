import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaExclamationCircle,
  FaArrowRight,
} from "react-icons/fa";
import { SAMPLE_VIDEO } from "../data";
import "./AuthForms.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          role,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const normalizedUser = {
          ...data.user,
          _id: data.user.id || data.user._id,
          id: data.user.id || data.user._id,
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        onLogin(normalizedUser);

        if (role === "staff") navigate("/staff-dashboard");
        else navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Background with video and emerald gradient overlay */}
      <div className="video-bg" aria-hidden>
        <video autoPlay muted loop playsInline>
          <source src={SAMPLE_VIDEO} type="video/mp4" />
        </video>
        <div className="overlay" />
      </div>

      {/* Decorative background shapes */}
      <div className="eco-orb orb-1" />
      <div className="eco-orb orb-2" />

      {/* Main Auth Card */}
      <div className="auth-card">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-icon-badge">
            <FaLeaf className="brand-icon" />
          </div>
          <h1 className="brand-title">NEXORA</h1>
          <p className="brand-subtitle">Environmental Learning & Eco Action</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="role-selector-wrap">
          <span className="role-label">Select Portal:</span>
          <div className="role-toggle-pill">
            <button
              type="button"
              className={`role-btn ${role === "student" ? "active" : ""}`}
              onClick={() => handleRoleChange("student")}
            >
              <FaUserGraduate className="role-btn-icon" />
              <span>Student</span>
            </button>
            <button
              type="button"
              className={`role-btn ${role === "staff" ? "active" : ""}`}
              onClick={() => handleRoleChange("staff")}
            >
              <FaChalkboardTeacher className="role-btn-icon" />
              <span>Staff</span>
            </button>
          </div>
          <p className="role-hint">
            {role === "student"
              ? "🌿 Play eco games, take quizzes & earn EcoPoints!"
              : "📊 View student analytics, game scores & class progress."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert error-alert">
            <FaExclamationCircle className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrap">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                className="input-box"
                name="email"
                type="email"
                placeholder={
                  role === "student" ? "student@school.edu" : "teacher@school.edu"
                }
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <FaLock className="input-icon" />
              <input
                id="password"
                className="input-box"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            <span>{loading ? "Authenticating..." : `Log In as ${role === "student" ? "Student" : "Staff"}`}</span>
            <FaArrowRight className="btn-arrow" />
          </button>
        </form>

        {/* Bottom Link to Sign Up */}
        <div className="auth-switch-link">
          <span>New to NEXORA? </span>
          <Link to="/signup" className="signup-link">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
