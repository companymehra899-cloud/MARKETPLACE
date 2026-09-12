import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { inr } from '../format.js';
import { useAuth } from '../context/AuthContext.jsx';
import SellerShell from '../components/SellerShell.jsx';

function useMine() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api('/api/my/listings').then((d) => setStats(d.stats || null));
  }, []);
  return stats;
}

export function OffersPage() {
  const stats = useMine();
  const [offers, setOffers] = useState([]);
  useEffect(() => {
    api('/api/my/offers').then((d) => setOffers(d.offers || []));
  }, []);
  return (
    <SellerShell stats={stats}>
      <div className="ml-head">
        <div>
          <h1>Offers</h1>
          <p>Incoming and outgoing offers on your listings.</p>
        </div>
      </div>
      <div className="table">
        {offers.map((o) => (
          <div key={o.id} className="table-row">
            <div>
              <strong>{o.listingName}</strong>
              <span>
                {o.buyerName} · {o.status}
              </span>
            </div>
            <b>{inr(o.amount)}</b>
            <span>{o.message || '—'}</span>
          </div>
        ))}
        {offers.length === 0 && <p className="empty">No offers yet.</p>}
      </div>
    </SellerShell>
  );
}

export function MessagesPage() {
  const stats = useMine();
  const [items, setItems] = useState([]);
  useEffect(() => {
    api('/api/messages').then((d) => setItems(d.messages || []));
  }, []);
  return (
    <SellerShell stats={stats}>
      <div className="ml-head">
        <div>
          <h1>Messages</h1>
          <p>Talk to buyers directly about a listing.</p>
        </div>
      </div>
      <div className="table">
        {items.map((m) => (
          <div key={m.id} className="table-row">
            <div>
              <strong>{m.fromName}</strong>
              <span>{m.listingName}</span>
            </div>
            <span>{m.text}</span>
          </div>
        ))}
        {items.length === 0 && <p className="empty">No messages yet.</p>}
      </div>
    </SellerShell>
  );
}

export function WatchlistPage() {
  const stats = useMine();
  const [items, setItems] = useState([]);
  useEffect(() => {
    api('/api/watchlist').then((d) => setItems(d.listings || []));
  }, []);
  return (
    <SellerShell stats={stats}>
      <div className="ml-head">
        <div>
          <h1>Watchlist</h1>
          <p>Projects you saved for later.</p>
        </div>
      </div>
      <div className="table">
        {items.map((l) => (
          <div key={l.id} className="table-row">
            <div>
              <strong>{l.name}</strong>
              <span>{l.category}</span>
            </div>
            <b>{inr(l.price)}</b>
            <Link to={`/listing/${l.id}`}>View</Link>
          </div>
        ))}
        {items.length === 0 && <p className="empty">Nothing saved yet.</p>}
      </div>
    </SellerShell>
  );
}

export function EarningsPage() {
  const stats = useMine();
  return (
    <SellerShell stats={stats}>
      <div className="ml-head">
        <div>
          <h1>Earnings</h1>
          <p>Closed deals from sold listings.</p>
        </div>
      </div>
      <div className="ml-stats">
        <div className="earn">
          <span className="dot purple">₹</span>
          <b>{inr(stats?.earnings || 0)}</b>
          <small>Total Earnings</small>
        </div>
        <div>
          <span className="dot red" />
          <b>{stats?.sold || 0}</b>
          <small>Sold</small>
        </div>
      </div>
    </SellerShell>
  );
}

export function ProfilePage() {
  const stats = useMine();
  const { user } = useAuth();
  return (
    <SellerShell stats={stats}>
      <div className="ml-head">
        <div>
          <h1>Profile Settings</h1>
          <p>Your public profile shown on listings.</p>
        </div>
      </div>
      <div className="panel" style={{ maxWidth: 520 }}>
        <p>
          <strong>{user.name}</strong>
        </p>
        <p className="empty">{user.email}</p>
        <p className="empty">Account · {user.verified ? 'Verified' : 'Unverified'}</p>
      </div>
    </SellerShell>
  );
}

export function SettingsPage() {
  const stats = useMine();
  return (
    <SellerShell stats={stats}>
      <div className="ml-head">
        <div>
          <h1>Account Settings</h1>
          <p>Notifications, password and login security.</p>
        </div>
      </div>
      <div className="panel" style={{ maxWidth: 520 }}>
        <p>Email alerts for new offers: On</p>
        <p>Email alerts for messages: On</p>
      </div>
    </SellerShell>
  );
}
