import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowRight,
  FaCalendarAlt,
} from "react-icons/fa";
import { SAMPLE_VIDEO } from "../data";
import "./AuthForms.css";

export default function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (role === "student" && !form.age) {
      return setError("Please enter your age for student signup.");
    }
    if (role === "staff" && form.age) {
      return setError("Staff signup does not require age.");
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role,
          ...(role === "student" && { age: form.age }),
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        const normalizedUser = {
          ...data.user,
          _id: data.user.id || data.user._id,
          id: data.user.id || data.user._id,
        };
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("role", role);

        setSuccess("Account created successfully! Redirecting...");
        onSignup(normalizedUser);

        setTimeout(() => {
          navigate(role === "staff" ? "/staff-dashboard" : "/dashboard");
        }, 800);
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      {/* Main Signup Card */}
      <div className="auth-card">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-icon-badge">
            <FaLeaf className="brand-icon" />
          </div>
          <h1 className="brand-title">Join NEXORA</h1>
          <p className="brand-subtitle">Create your environmental learning account</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="role-selector-wrap">
          <span className="role-label">Register As:</span>
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
              ? "🌱 Start learning, play games, and compete on the leaderboard!"
              : "👩‍🏫 Monitor student progress, review exam logs & mentor learners."}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert error-alert">
            <FaExclamationCircle className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="auth-alert success-alert">
            <FaCheckCircle className="alert-icon" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrap">
              <FaUser className="input-icon" />
              <input
                id="name"
                className="input-box"
                name="name"
                type="text"
                placeholder={role === "student" ? "e.g. Alex Green" : "e.g. Prof. Green"}
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrap">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                className="input-box"
                name="email"
                type="email"
                placeholder={role === "student" ? "student@school.edu" : "teacher@school.edu"}
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {role === "student" && (
            <div className="input-field">
              <label htmlFor="age">Age</label>
              <div className="input-wrap">
                <FaCalendarAlt className="input-icon" />
                <input
                  id="age"
                  className="input-box"
                  name="age"
                  type="number"
                  min="5"
                  max="100"
                  placeholder="Enter your age (e.g. 11)"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-field">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <FaLock className="input-icon" />
              <input
                id="password"
                className="input-box"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            <span>{loading ? "Creating Account..." : `Sign Up as ${role === "student" ? "Student" : "Staff"}`}</span>
            <FaArrowRight className="btn-arrow" />
          </button>
        </form>

        {/* Bottom Link to Login */}
        <div className="auth-switch-link">
          <span>Already have an account? </span>
          <Link to="/" className="signup-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
