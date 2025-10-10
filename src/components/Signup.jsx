import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (role === "student" && !form.age) {
      return setError("Please enter your age for student signup.");
    }
    if (role === "staff" && form.age) {
      return setError("Staff signup should not include age.");
    }

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
      console.log("Signup response:", data);

      if (res.ok && data.user) {
        localStorage.setItem("token", data.token || "");
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", role);

        setSuccess("Account created successfully!");
        onSignup(data.user);

        setTimeout(() => {
          navigate(role === "staff" ? "/staff-dashboard" : "/dashboard");
        }, 800);
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

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

      {/* Signup Card */}
      <div className="auth-card">
        <div className="intro">
          <h1 style={{ color: themeColor }}>Welcome to NEXORA</h1>
          <p>Create your {role} account</p>

          <div className="role-toggle">
            <button
              type="button"
              onClick={() => setRole("student")}
              style={{
                background: role === "student" ? themeColor : "#ccc",
              }}
            >
              Student
            </button>
            <button
              type="button"
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
            name="name"
            placeholder={
              role === "student" ? "Student Name" : "Staff Name"
            }
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            name="email"
            type="email"
            placeholder={
              role === "student"
                ? "student@school.edu"
                : "staff@school.edu"
            }
            value={form.email}
            onChange={handleChange}
            required
          />
          {role === "student" && (
            <input
              className="input"
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              required
            />
          )}
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
            Sign Up
          </button>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </div>
    </div>
  );
}
