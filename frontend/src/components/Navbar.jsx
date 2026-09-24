import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const initial = (user?.name || 'A').charAt(0).toUpperCase();
  const onApps = location.pathname.startsWith('/apps');
  const marketPath = ['/vehicles', '/mobiles', '/services', '/tours'].find((p) =>
    location.pathname.startsWith(p)
  );
  const searchPath = marketPath || (onApps ? '/apps' : '/websites');

  function onSearch(e) {
    e.preventDefault();
    const term = q.trim();
    setOpen(false);
    navigate(`${searchPath}${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Logo />
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/websites" onClick={() => setOpen(false)}>
            Websites
          </NavLink>
          <NavLink to="/apps" onClick={() => setOpen(false)}>
            Apps
          </NavLink>
          <NavLink to="/vehicles" onClick={() => setOpen(false)}>
            Vehicles
          </NavLink>
          <NavLink to="/mobiles" onClick={() => setOpen(false)}>
            Mobiles
          </NavLink>
          <NavLink to="/services" onClick={() => setOpen(false)}>
            Services
          </NavLink>
          <NavLink to="/tours" onClick={() => setOpen(false)}>
            Tours
          </NavLink>
          <NavLink to="/sell" onClick={() => setOpen(false)}>
            Sell
          </NavLink>
        </nav>
        <form className="nav-search" onSubmit={onSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={onApps ? 'Search apps...' : 'Search websites or apps...'}
          />
          <button type="submit" className="nav-search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </button>
        </form>
        <div className="nav-auth">
          {user ? (
            <>
              <button className="user-chip" type="button" onClick={() => setMenu((v) => !v)}>
                <span className="avatar sm">{initial}</span>
                <span>
                  <b>{user.name.split(' ')[0]}</b>
                  <small>{user.role === 'admin' ? 'Admin' : 'Account'}</small>
                </span>
              </button>
              {menu && (
                <div className="user-menu">
                  {user.role === 'admin' ? (
                    <>
                      <NavLink to="/admin" onClick={() => setMenu(false)}>
                        Admin Panel
                      </NavLink>
                      <NavLink to="/admin/messages" onClick={() => setMenu(false)}>
                        Messages
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink to="/dashboard" onClick={() => setMenu(false)}>
                        Dashboard
                      </NavLink>
                      <NavLink to="/dashboard/listings" onClick={() => setMenu(false)}>
                        My Listings
                      </NavLink>
                      <NavLink to="/dashboard/profile" onClick={() => setMenu(false)}>
                        Profile
                      </NavLink>
                      <NavLink to="/dashboard/settings" onClick={() => setMenu(false)}>
                        Settings
                      </NavLink>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMenu(false);
                      logout();
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-outline">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
        <button className="menu-btn" type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
}
