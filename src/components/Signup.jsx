import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAMPLE_VIDEO } from '../data';

export default function Signup({ onSignup }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    institution: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // 🔗 Call backend signup API
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Signup successful
        setSuccess('Account created successfully!');
        onSignup(data.user);
        navigate('/dashboard');
      } else {
        // ❌ Signup failed
        setError(data.message || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="video-bg" aria-hidden>
        <video autoPlay muted loop playsInline>
          <source src={SAMPLE_VIDEO} type="video/mp4" />
        </video>
        <div className="overlay" />
      </div>

      <div className="auth-card">
        <div className="auth-left">
          <div className="logo">KidsLearn</div>
          <h2>Create your account</h2>
        </div>

        <div className="auth-right">
          <form className="form" onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="input"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                className="input"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <input
              className="input"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />
            <input
              className="input"
              name="institution"
              placeholder="School / College"
              value={form.institution}
              onChange={handleChange}
            />
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
            <button className="btn btn-primary" type="submit">
              Sign up
            </button>
            {error && (
              <p style={{ color: 'red', marginTop: 8 }}>{error}</p>
            )}
            {success && (
              <p style={{ color: 'green', marginTop: 8 }}>{success}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

