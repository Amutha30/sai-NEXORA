import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SAMPLE_VIDEO } from "../data";
import "./AuthForms.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user);

        if (role === "staff") navigate("/staff-dashboard");
        else navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  }

  const bgColor = role === "student" ? "#e3f2fd" : "#e8f5e9";
  const themeColor = role === "student" ? "#1976d2" : "#2e7d32";

  return (
    <div className="auth-page" style={{ background: bgColor }}>
      {/* Background video */}
      <div className="video-bg" aria-hidden>
        <video autoPlay muted loop playsInline>
          <source src={SAMPLE_VIDEO} type="video/mp4" />
        </video>
        <div className="overlay" />
      </div>

      <div className="auth-card">
        <div className="intro">
          <h1 style={{ color: themeColor }}>Welcome to NEXORA</h1>
          <p>Login to your {role} account</p>

          <div className="role-toggle">
            <button
              onClick={() => setRole("student")}
              style={{
                background: role === "student" ? themeColor : "#ccc",
              }}
            >
              Student
            </button>
            <button
              onClick={() => setRole("staff")}
              style={{
                background: role === "staff" ? themeColor : "#ccc",
              }}
            >
              Staff
            </button>
          </div>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            className="btn"
            type="submit"
            style={{ background: themeColor }}
          >
            Login
          </button>

          {error && <p className="error">{error}</p>}

          <div className="link-text">
            <span>New? </span>
            <Link to="/signup" style={{ color: themeColor }}>
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
