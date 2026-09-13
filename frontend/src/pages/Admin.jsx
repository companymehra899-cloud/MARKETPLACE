import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { inr, typeLabel } from '../format.js';
import { useAuth } from '../context/AuthContext.jsx';
import Cover from '../components/Cover.jsx';

const TABS = [
  { id: 'pending', label: 'Under Review' },
  { id: 'approved', label: 'Active' },
  { id: 'sold', label: 'Sold' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'all', label: 'All Listings' },
];

const LINKS = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/listings', label: 'Listings' },
  { to: '/admin/users', label: 'Accounts' },
  { to: '/admin/messages', label: 'Messages' },
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
            <strong>{user?.name}</strong>
            <small>Admin</small>
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

function Overview({ stats, listings, users }) {
  const pending = listings.filter((l) => l.status === 'pending').slice(0, 4);
  const accounts = users.filter((u) => u.role !== 'admin').slice(0, 4);
  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Review listings, accounts, and messages on the same NexMarket flow.</p>
        </div>
      </div>
      <div className="ml-stats">
        <div>
          <span className="dot orange" />
          <b>{stats?.pending || 0}</b>
          <small>Under Review</small>
        </div>
        <div>
          <span className="dot green" />
          <b>{stats?.approved || 0}</b>
          <small>Active</small>
        </div>
        <div>
          <span className="dot red" />
          <b>{stats?.sold || 0}</b>
          <small>Sold</small>
        </div>
        <div>
          <span className="dot blue" />
          <b>{stats?.users || 0}</b>
          <small>Accounts</small>
        </div>
        <div className="earn">
          <span className="dot purple" />
          <b>{stats?.atLimit || 0}</b>
          <small>At 3-listing limit</small>
        </div>
      </div>
      <div className="dash-grid">
        <div className="panel">
          <div className="section-head">
            <h2>Pending listings</h2>
            <Link to="/admin/listings">View All →</Link>
          </div>
          {pending.map((l) => (
            <div key={l.id} className="mini-row">
              <Cover listing={l} className="tiny" />
              <div>
                <strong>{l.name}</strong>
                <span>
                  {typeLabel(l.type)} · {l.seller?.name}
                </span>
              </div>
              <b>{inr(l.price)}</b>
            </div>
          ))}
          {pending.length === 0 && <p className="empty">No listings waiting for review.</p>}
        </div>
        <div className="panel">
          <div className="section-head">
            <h2>Recent accounts</h2>
            <Link to="/admin/users">View All →</Link>
          </div>
          {accounts.map((u) => (
            <div key={u.id} className="mini-row">
              <div>
                <strong>{u.name}</strong>
                <span>
                  {u.email} · {u.listingCount}/{u.listingLimit || 3} listings
                </span>
              </div>
              <b>{u.verified ? 'Verified' : 'Unverified'}</b>
            </div>
          ))}
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
    pending: listings.filter((l) => l.status === 'pending').length,
    approved: listings.filter((l) => l.status === 'approved').length,
    sold: listings.filter((l) => l.status === 'sold').length,
    rejected: listings.filter((l) => l.status === 'rejected').length,
    all: listings.length,
  };

  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Listings</h1>
          <p>Approve, reject, or feature websites and Android apps. Monetization and app size come from the sell form.</p>
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
        {visible.map((l) => {
          const isApp = l.type === 'app';
          return (
            <article key={l.id} className="ml-row admin-row">
              <Cover listing={l} />
              <div className="ml-info">
                <h3>{l.name}</h3>
                <p className="meta">
                  <span>{typeLabel(l.type)}</span>
                  <em>{l.category}</em>
                  <em>Monetization: {l.monetization || '—'}</em>
                </p>
                <div className="ml-metrics">
                  {isApp ? (
                    <>
                      <span>
                        <b>{l.downloads || '—'}</b>
                        <small>Downloads</small>
                      </span>
                      <span>
                        <b>{l.appSize || '—'}</b>
                        <small>App Size</small>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        <b>{l.traffic || '—'}</b>
                        <small>Monthly Visitors</small>
                      </span>
                      <span>
                        <b>{inr(l.monthlyRevenue)}</b>
                        <small>Monthly Revenue</small>
                      </span>
                    </>
                  )}
                  <span>
                    <b>{l.seller?.name || 'Account'}</b>
                    <small>{l.seller?.id ? 'Seller account' : 'Unknown'}</small>
                  </span>
                </div>
              </div>
              <div className="ml-price">
                <strong>{inr(l.price)}</strong>
                <span className={`st ${l.status}`}>{l.uiStatus || l.status}</span>
                {l.featured ? <small>Featured</small> : <small>Listed on {l.listedOn}</small>}
              </div>
              <div className="ml-actions">
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
                <button className="ghost-btn" type="button" onClick={() => onPatch(l.id, { featured: !l.featured })}>
                  {l.featured ? 'Unfeature' : 'Feature'}
                </button>
                <Link className="ghost-btn" to={`/listing/${l.id}`}>
                  View
                </Link>
              </div>
            </article>
          );
        })}
        {visible.length === 0 && <p className="empty">No listings in this tab.</p>}
      </div>
    </>
  );
}

function Accounts({ users, onVerify }) {
  const accounts = users.filter((u) => u.role !== 'admin');
  return (
    <>
      <div className="ml-head">
        <div>
          <h1>Accounts</h1>
          <p>One account for buy and sell. Free plan is 3 listings per user.</p>
        </div>
      </div>
      <div className="ml-list">
        {accounts.map((u) => {
          const limit = u.listingLimit || 3;
          const atLimit = u.listingCount >= limit;
          return (
            <article key={u.id} className="ml-row admin-user">
              <span className="avatar">{(u.name || 'A').charAt(0).toUpperCase()}</span>
              <div className="ml-info">
                <h3>{u.name}</h3>
                <p className="meta">
                  <span>{u.email}</span>
                  <em>{u.phone || 'No mobile number'}</em>
                </p>
                <div className="ml-metrics">
                  <span>
                    <b>
                      {u.listingCount}/{limit}
                    </b>
                    <small>Free listings</small>
                  </span>
                  <span>
                    <b>{u.verified ? 'Verified' : 'Unverified'}</b>
                    <small>Account</small>
                  </span>
                </div>
              </div>
              <div className="ml-price">
                <span className={`st ${atLimit ? 'sold' : 'approved'}`}>{atLimit ? 'Limit reached' : 'Slots open'}</span>
              </div>
              <div className="ml-actions">
                <button className="ghost-btn" type="button" onClick={() => onVerify(u.id, !u.verified)}>
                  {u.verified ? 'Unverify' : 'Verify'}
                </button>
              </div>
            </article>
          );
        })}
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
          <p>Buyer and seller contact from listing details.</p>
        </div>
      </div>
      <div className="table">
        {messages.map((m) => (
          <div key={m.id} className="table-row">
            <div>
              <strong>{m.fromName}</strong>
              <span>
                to {m.toName} · {m.listingName}
              </span>
            </div>
            <span>{m.text}</span>
          </div>
        ))}
        {messages.length === 0 && <p className="empty">No messages yet.</p>}
      </div>
    </>
  );
}

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const { pathname } = useLocation();

  async function load() {
    const [s, l, u, m] = await Promise.all([
      api('/api/admin/stats'),
      api('/api/admin/listings'),
      api('/api/admin/users'),
      api('/api/admin/messages'),
    ]);
    setStats(s);
    setListings(l.listings || []);
    setUsers(u.users || []);
    setMessages(m.messages || []);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function patchListing(id, body) {
    await api(`/api/admin/listings/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
    load();
  }

  async function verifyUser(id, verified) {
    await api(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ verified }) });
    load();
  }

  let view = <Overview stats={stats} listings={listings} users={users} />;
  if (pathname.startsWith('/admin/listings')) view = <Listings listings={listings} onPatch={patchListing} />;
  else if (pathname.startsWith('/admin/users')) view = <Accounts users={users} onVerify={verifyUser} />;
  else if (pathname.startsWith('/admin/messages')) view = <Messages messages={messages} />;

  return <AdminShell>{view}</AdminShell>;
}
