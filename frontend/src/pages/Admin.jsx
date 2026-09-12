import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { inr } from '../format.js';
import PageLayout from '../components/PageLayout.jsx';

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('pending');

  async function load() {
    const [s, l, u] = await Promise.all([
      api('/api/admin/stats'),
      api('/api/admin/listings'),
      api('/api/admin/users'),
    ]);
    setStats(s);
    setListings(l.listings || []);
    setUsers(u.users || []);
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

  const filtered = listings.filter((l) => (tab === 'all' ? true : l.status === tab));

  return (
    <PageLayout>
      <p className="eyebrow">Admin</p>
      <h1>Listing review</h1>
      {stats && (
        <div className="stat-row">
          <div>
            <b>{stats.pending}</b>
            <span>Pending</span>
          </div>
          <div>
            <b>{stats.approved}</b>
            <span>Approved</span>
          </div>
          <div>
            <b>{stats.rejected}</b>
            <span>Rejected</span>
          </div>
          <div>
            <b>{stats.users}</b>
            <span>Users</span>
          </div>
        </div>
      )}

      <div className="tabs">
        {['pending', 'approved', 'rejected', 'all'].map((t) => (
          <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="table">
        {filtered.map((l) => (
          <div key={l.id} className="table-row admin">
            <div>
              <strong>{l.name}</strong>
              <span>
                {l.type} · {l.category} · {inr(l.price)} · {l.status}
                {l.featured ? ' · featured' : ''}
              </span>
            </div>
            <div className="actions">
              <button onClick={() => patchListing(l.id, { status: 'approved' })}>Approve</button>
              <button onClick={() => patchListing(l.id, { status: 'rejected' })}>Reject</button>
              <button onClick={() => patchListing(l.id, { featured: !l.featured })}>
                {l.featured ? 'Unfeature' : 'Feature'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="dash-block">
        <h2>Users</h2>
        <div className="table">
          {users.map((u) => (
            <div key={u.id} className="table-row">
              <div>
                <strong>{u.name}</strong>
                <span>
                  {u.email} · {u.role}
                  {u.verified ? ' · verified' : ''}
                </span>
              </div>
              <button onClick={() => verifyUser(u.id, !u.verified)}>
                {u.verified ? 'Unverify' : 'Verify'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
