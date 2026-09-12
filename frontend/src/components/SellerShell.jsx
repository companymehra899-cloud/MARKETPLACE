import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'home' },
  { to: '/dashboard/listings', label: 'My Listings', icon: 'plus' },
  { to: '/sell', label: 'Add New Listing', icon: 'add' },
  { to: '/dashboard/offers', label: 'Offers', icon: 'mail', badgeKey: 'offers' },
  { to: '/dashboard/messages', label: 'Messages', icon: 'chat' },
  { to: '/dashboard/watchlist', label: 'Watchlist', icon: 'heart' },
  { to: '/dashboard/earnings', label: 'Earnings', icon: 'inr' },
  { to: '/dashboard/profile', label: 'Profile Settings', icon: 'user' },
  { to: '/dashboard/settings', label: 'Account Settings', icon: 'gear' },
  { to: '/help', label: 'Help & Support', icon: 'help' },
];

function Glyph({ name }) {
  const common = { width: 18, height: 18, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 };
  if (name === 'home') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M4 10.5L12 4l8 6.5V20H4V10.5z" />
      </svg>
    );
  }
  if (name === 'plus') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="4" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }
  if (name === 'add') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    );
  }
  if (name === 'mail') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    );
  }
  if (name === 'chat') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M5 6h14v10H8l-3 3V6z" />
      </svg>
    );
  }
  if (name === 'heart') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
      </svg>
    );
  }
  if (name === 'inr') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <path d="M7 6h10M7 10h10M7 6c4 0 6 2 6 5s-2 5-6 5h4l5 4" />
      </svg>
    );
  }
  if (name === 'user') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="3" />
        <path d="M5 19c1-4 4-6 7-6s6 2 7 6" />
      </svg>
    );
  }
  if (name === 'gear') {
    return (
      <svg {...common} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      </svg>
    );
  }
  return (
    <svg {...common} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}

export default function SellerShell({ stats, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.name || 'A').charAt(0).toUpperCase();

  return (
    <div className="seller-layout">
      <aside className="seller-side">
        <div className="seller-user">
          <span className="avatar">{initial}</span>
          <div>
            <strong>{user?.name}</strong>
            <small>Account</small>
          </div>
        </div>
        <nav className="seller-nav">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/dashboard'}>
              <Glyph name={l.icon} />
              <span>{l.label}</span>
              {l.badgeKey && stats?.[l.badgeKey] ? <em>{stats[l.badgeKey]}</em> : null}
            </NavLink>
          ))}
        </nav>
        <button
          className="logout-side"
          type="button"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Logout
        </button>
      </aside>
      <section className="seller-main">{children}</section>
    </div>
  );
}
