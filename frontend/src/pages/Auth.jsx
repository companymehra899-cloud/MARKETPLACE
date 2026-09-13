import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [step, setStep] = useState('form');
  const [busy, setBusy] = useState(false);
  const isLogin = mode === 'login';

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const next = isLogin ? await login(email, password) : await register(name, email, password);
      navigate(next?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  async function sendOtp(e) {
    e.preventDefault();
    setError('');
    setNote('');
    setBusy(true);
    try {
      const data = await api('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSentOtp(data.otp || '');
      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(e) {
    e.preventDefault();
    setError('');
    setNote('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await api('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setSentOtp('');
      setStep('form');
      setNote('Password updated. Login with your new password.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (isLogin && step === 'forgot') {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <p className="eyebrow">Reset access</p>
          <h1>Forgot Password</h1>
          <p className="lede">Enter your account email to get a 6-digit OTP.</p>
          <form className="form" onSubmit={sendOtp}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary full" type="submit" disabled={busy}>
              {busy ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
          <p className="switch">
            <button type="button" className="text-link" onClick={() => { setStep('form'); setError(''); }}>
              Back to Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (isLogin && step === 'otp') {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <p className="eyebrow">Verify OTP</p>
          <h1>Enter OTP</h1>
          <p className="lede">Use the 6-digit OTP for {email} and set a new password.</p>
          {sentOtp && (
            <p className="otp-show">
              Your OTP is <strong>{sentOtp}</strong>
            </p>
          )}
          <form className="form" onSubmit={resetPassword}>
            <label>OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              maxLength={6}
              required
            />
            <label>New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
            />
            <label>Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary full" type="submit" disabled={busy}>
              {busy ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
          <p className="switch">
            <button type="button" className="text-link" onClick={() => { setStep('forgot'); setError(''); setOtp(''); }}>
              Use a different email
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <p className="eyebrow">{isLogin ? 'Welcome back' : 'Join NexMarket'}</p>
        <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
        <p className="lede">
          {isLogin
            ? 'One account to buy and sell websites and Android apps.'
            : 'Create one account to buy or sell websites and Android apps.'}
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
          {isLogin && (
            <button
              type="button"
              className="forgot-link"
              onClick={() => {
                setError('');
                setNote('');
                setStep('forgot');
              }}
            >
              Forgot password?
            </button>
          )}
          {error && <p className="error">{error}</p>}
          {note && <p className="empty">{note}</p>}
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
