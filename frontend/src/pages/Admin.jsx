import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { inr, typeLabel } from '../format.js';
import { useAuth } from '../context/AuthContext.jsx';
import Cover from '../components/Cover.jsx';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Active' },
  { id: 'rejected', label: 'Rejected' },
];

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/listings', label: 'Listings' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/settings', label: 'Settings' },
];

function AdminShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.name || 'A').charAt(0).toUpperCase();

  return (
    <div className="seller-layout">
      <aside className="seller-side">
        <div className="seller-user">
          <span className="avatar">{initial}</span>
          <div>
            <strong>NEXMARKET ADMIN</strong>
            <small>{user?.name}</small>
          </div>
        </div>
        <nav className="seller-nav">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              <span>{l.label}</span>
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

function Dashboard({ stats, listings, users }) {
  const recentListings = (listings || []).slice(0, 5);
  const recentUsers = (users || []).slice(0, 5);
  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Dashboard</h1>
          <p>Overall marketplace status.</p>
        </div>
      </div>
      <div className="ml-stats admin-stats">
        <div>
          <span className="dot blue" />
          <b>{stats?.users || 0}</b>
          <small>Total Users</small>
        </div>
        <div>
          <span className="dot purple" />
          <b>{stats?.listings || 0}</b>
          <small>Total Listings</small>
        </div>
        <div>
          <span className="dot orange" />
          <b>{stats?.pending || 0}</b>
          <small>Pending Listings</small>
        </div>
        <div>
          <span className="dot green" />
          <b>{stats?.approved || 0}</b>
          <small>Active Listings</small>
        </div>
      </div>
      <div className="dash-grid">
        <div className="panel">
          <div className="section-head">
            <h2>Recent Listings</h2>
            <Link to="/admin/listings">View All →</Link>
          </div>
          {recentListings.map((l) => (
            <div key={l.id} className="mini-row">
              <Cover listing={l} className="tiny" />
              <div>
                <strong>{l.name}</strong>
                <span>
                  {typeLabel(l.type)} · {l.seller?.name || 'User'}
                </span>
              </div>
              <b>{inr(l.price)}</b>
            </div>
          ))}
          {recentListings.length === 0 && <p className="empty">No listings yet.</p>}
        </div>
        <div className="panel">
          <div className="section-head">
            <h2>Recent Users</h2>
            <Link to="/admin/users">View All →</Link>
          </div>
          {recentUsers.map((u) => (
            <div key={u.id} className="mini-row">
              <div>
                <strong>{u.name}</strong>
                <span>
                  {u.email}
                  {u.phone ? ` · ${u.phone}` : ''} · {u.listingCount} listings
                </span>
              </div>
              <b>{u.blocked ? 'Blocked' : 'Active'}</b>
            </div>
          ))}
          {recentUsers.length === 0 && <p className="empty">No users yet.</p>}
        </div>
      </div>
    </>
  );
}

function Listings({ listings, onPatch }) {
  const [tab, setTab] = useState('pending');
  const visible = useMemo(() => {
    if (tab === 'all') return listings;
    return listings.filter((l) => l.status === tab);
  }, [listings, tab]);
  const counts = {
    all: listings.length,
    pending: listings.filter((l) => l.status === 'pending').length,
    approved: listings.filter((l) => l.status === 'approved').length,
    rejected: listings.filter((l) => l.status === 'rejected').length,
  };

  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Listings</h1>
          <p>Approve, reject, or remove website and app listings.</p>
        </div>
      </div>
      <div className="ml-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label} ({counts[t.id] || 0})
          </button>
        ))}
      </div>
      <div className="ml-list">
        {visible.map((l) => (
          <article key={l.id} className="ml-row admin-row">
            <Cover listing={l} />
            <div className="ml-info">
              <h3>{l.name}</h3>
                <p className="meta">
                  <span>{typeLabel(l.type)}</span>
                  <em>{inr(l.price)}</em>
                  <em>{l.seller?.name || 'User'}</em>
                  {l.seller?.phone ? <em>{l.seller.phone}</em> : null}
                </p>
            </div>
            <div className="ml-price">
              <span className={`st ${l.status}`}>{l.uiStatus || l.status}</span>
            </div>
            <div className="ml-actions">
              <Link className="ghost-btn" to={`/listing/${l.id}`}>
                View
              </Link>
              {l.status !== 'approved' && (
                <button className="ghost-btn" type="button" onClick={() => onPatch(l.id, { status: 'approved' })}>
                  Approve
                </button>
              )}
              {l.status !== 'rejected' && (
                <button className="ghost-btn" type="button" onClick={() => onPatch(l.id, { status: 'rejected' })}>
                  Reject
                </button>
              )}
              <button className="ghost-btn" type="button" onClick={() => onPatch(l.id, { removed: true })}>
                Remove
              </button>
            </div>
          </article>
        ))}
        {visible.length === 0 && <p className="empty">No listings in this tab.</p>}
      </div>
    </>
  );
}

function Users({ users, onBlock }) {
  const [openId, setOpenId] = useState('');
  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Users</h1>
          <p>One account for buy and sell. View users and block spam.</p>
        </div>
      </div>
      <div className="ml-list">
        {users.map((u) => {
          const open = openId === u.id;
          return (
            <article key={u.id} className="ml-row admin-user">
              <span className="avatar">{(u.name || 'A').charAt(0).toUpperCase()}</span>
              <div className="ml-info">
                <h3>{u.name}</h3>
                <p className="meta">
                  <span>{u.email}</span>
                  {u.phone ? <span>{u.phone}</span> : null}
                  <em>{u.listingCount} Listings</em>
                </p>
                {open && (
                  <div className="admin-user-listings">
                    {(u.listings || []).length === 0 && <p className="empty">No listings.</p>}
                    {(u.listings || []).map((l) => (
                      <p key={l.id} className="meta">
                        <Link to={`/listing/${l.id}`}>{l.name}</Link>
                        <em>{typeLabel(l.type)}</em>
                        <em>{inr(l.price)}</em>
                        <em>{l.uiStatus}</em>
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="ml-price">
                <span className={`st ${u.blocked ? 'sold' : 'approved'}`}>{u.blocked ? 'Blocked' : 'Active'}</span>
              </div>
              <div className="ml-actions">
                <button className="ghost-btn" type="button" onClick={() => setOpenId(open ? '' : u.id)}>
                  {open ? 'Hide' : 'View User'}
                </button>
                <button className="ghost-btn" type="button" onClick={() => onBlock(u.id, !u.blocked)}>
                  {u.blocked ? 'Unblock' : 'Block User'}
                </button>
              </div>
            </article>
          );
        })}
        {users.length === 0 && <p className="empty">No users yet.</p>}
      </div>
    </>
  );
}

function Messages({ messages }) {
  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Messages</h1>
          <p>Support messages from Contact Support on Sell Your Project and the contact page.</p>
        </div>
      </div>
      <div className="table">
        {messages.map((m) => (
          <div key={m.id} className="table-row">
            <div>
              <strong>{m.fromName}</strong>
              <span>
                {m.fromEmail || 'No email'}
                {m.fromPhone ? ` · ${m.fromPhone}` : ''}
              </span>
            </div>
            <span>{m.text}</span>
            <em>{new Date(m.createdAt).toLocaleString('en-IN')}</em>
          </div>
        ))}
        {messages.length === 0 && <p className="empty">No support messages yet.</p>}
      </div>
    </>
  );
}

function Payments({ payments, onReview }) {
  const [tab, setTab] = useState('pending');
  const visible = useMemo(() => {
    if (tab === 'all') return payments;
    return payments.filter((p) => p.status === tab);
  }, [payments, tab]);
  const counts = {
    all: payments.length,
    pending: payments.filter((p) => p.status === 'pending').length,
    approved: payments.filter((p) => p.status === 'approved').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
  };

  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Payments</h1>
          <p>Check UTR and payment profile name, then approve ₹100 packs for 5 extra listings.</p>
        </div>
      </div>
      <div className="ml-tabs">
        {[
          { id: 'pending', label: 'Pending' },
          { id: 'approved', label: 'Approved' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'all', label: 'All' },
        ].map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label} ({counts[t.id] || 0})
          </button>
        ))}
      </div>
      <div className="ml-list">
        {visible.map((p) => (
          <article key={p.id} className="ml-row admin-pay">
            <div className="ml-info">
              <h3>{p.user?.name || 'User'}</h3>
              <p className="meta">
                <span>{p.user?.email}</span>
                {p.user?.phone ? <em>{p.user.phone}</em> : null}
                <em>
                  {p.user?.listingCount || 0}/{p.user?.listingLimit || 3} listings
                </em>
              </p>
              <p className="meta">
                <span>UTR {p.utr}</span>
                <em>{p.payerName}</em>
                <em>₹{p.amount}</em>
                <em>{p.slots} listings</em>
              </p>
            </div>
            <div className="ml-price">
              <span className={`st ${p.status}`}>{p.status}</span>
              <small>{new Date(p.createdAt).toLocaleString('en-IN')}</small>
            </div>
            <div className="ml-actions">
              {p.status === 'pending' && (
                <>
                  <button className="ghost-btn" type="button" onClick={() => onReview(p.id, 'approved')}>
                    Approve
                  </button>
                  <button className="ghost-btn" type="button" onClick={() => onReview(p.id, 'rejected')}>
                    Reject
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
        {visible.length === 0 && <p className="empty">No payments in this tab.</p>}
      </div>
    </>
  );
}

function Reports({ reports }) {
  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Reports</h1>
          <p>Reported listings from users. Public report button can be added later.</p>
        </div>
      </div>
      <div className="table">
        {reports.map((r) => (
          <div key={r.id} className="table-row">
            <div>
              <strong>{r.listingName}</strong>
              <span>
                {r.fromName} · {r.fromEmail}
              </span>
            </div>
            <span>{r.reason}</span>
            {r.listingId && !r.listingRemoved && (
              <Link to={`/listing/${r.listingId}`}>View</Link>
            )}
          </div>
        ))}
        {reports.length === 0 && <p className="empty">No reported listings yet.</p>}
      </div>
    </>
  );
}

function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  async function save(e) {
    e.preventDefault();
    setError('');
    setNote('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await api('/api/auth/password', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNote('Password updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Settings</h1>
          <p>Change the admin login password.</p>
        </div>
      </div>
      <form className="panel form profile-form" onSubmit={save}>
        <h2>Change Password</h2>
        <label>Current password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
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
        {note && <p className="empty">{note}</p>}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? 'Saving...' : 'Update Password'}
        </button>
      </form>
    </>
  );
}

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  const [payments, setPayments] = useState([]);
  const { pathname } = useLocation();

  async function load() {
    const [s, l, u, r, m, p] = await Promise.all([
      api('/api/admin/stats'),
      api('/api/admin/listings'),
      api('/api/admin/users'),
      api('/api/admin/reports'),
      api('/api/admin/messages'),
      api('/api/admin/payments'),
    ]);
    setStats(s);
    setListings(l.listings || []);
    setUsers(u.users || []);
    setReports(r.reports || []);
    setMessages((m.messages || []).filter((item) => item.kind === 'support'));
    setPayments(p.payments || []);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function patchListing(id, body) {
    await api(`/api/admin/listings/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
    load();
  }

  async function blockUser(id, blocked) {
    await api(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ blocked }) });
    load();
  }

  async function reviewPayment(id, status) {
    await api(`/api/admin/payments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    load();
  }

  let view = <Dashboard stats={stats} listings={listings} users={users} />;
  if (pathname.startsWith('/admin/listings')) view = <Listings listings={listings} onPatch={patchListing} />;
  else if (pathname.startsWith('/admin/users')) view = <Users users={users} onBlock={blockUser} />;
  else if (pathname.startsWith('/admin/payments')) view = <Payments payments={payments} onReview={reviewPayment} />;
  else if (pathname.startsWith('/admin/messages')) view = <Messages messages={messages} />;
  else if (pathname.startsWith('/admin/reports')) view = <Reports reports={reports} />;
  else if (pathname.startsWith('/admin/settings')) view = <Settings />;

  return <AdminShell>{view}</AdminShell>;
}
