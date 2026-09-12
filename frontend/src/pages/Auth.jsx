import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isLogin = mode === 'login';

  if (user) return <Navigate to="/dashboard" replace />;

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <p className="eyebrow">{isLogin ? 'Welcome back' : 'Join NexMarket'}</p>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <p className="lede">
          {isLogin
            ? 'Access your listings, offers, and saved deals.'
            : 'Create an account to list a website or Android app, or to make offers.'}
        </p>
        <form className="form" onSubmit={submit}>
          {!isLogin && (
            <>
              <label>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </>
          )}
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary full" type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="switch">
          {isLogin ? (
            <>
              New here? <Link to="/register">Sign Up</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to="/login">Login</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
