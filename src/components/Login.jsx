import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SAMPLE_VIDEO } from '../data';

export default function Login({ onLogin }){
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  function handleSubmit(e){
    e.preventDefault();
    const demoUser = { firstName: 'Demo', lastName: 'Kid', email: form.email };
    onLogin(demoUser);
    navigate('/dashboard');
  }

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
          <h2>Welcome back!</h2>
        </div>

        <div className="auth-right">
          <form className="form" onSubmit={handleSubmit}>
            <input className="input" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input className="input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
            <button className="btn btn-primary" type="submit">Login</button>
            <div style={{marginTop:12}}>
              <span>New? </span>
              <Link to="/signup">Create account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
