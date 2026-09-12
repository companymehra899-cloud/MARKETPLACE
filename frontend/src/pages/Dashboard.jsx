import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { inr } from '../format.js';
import SellerShell from '../components/SellerShell.jsx';
import Cover from '../components/Cover.jsx';

export default function Dashboard() {
  const [listings, setListings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api('/api/my/listings').then((d) => {
      setListings(d.listings || []);
      setStats(d.stats || null);
    });
    api('/api/my/offers').then((d) => setOffers(d.offers || []));
  }, []);

  return (
    <SellerShell stats={stats}>
      <div className="ml-head">
        <div>
          <h1>Dashboard</h1>
          <p>Snapshot of listings, offers and earnings.</p>
        </div>
        <Link className="btn btn-primary" to="/sell">
          + Add New Listing
        </Link>
      </div>
      <div className="ml-stats">
        <div>
          <span className="dot blue" />
          <b>{stats?.total || 0}</b>
          <small>Total Listings</small>
        </div>
        <div>
          <span className="dot green" />
          <b>{stats?.active || 0}</b>
          <small>Active</small>
        </div>
        <div>
          <span className="dot orange" />
          <b>{stats?.review || 0}</b>
          <small>Under Review</small>
        </div>
        <div>
          <span className="dot red" />
          <b>{stats?.sold || 0}</b>
          <small>Sold</small>
        </div>
        <div className="earn">
          <span className="dot purple">₹</span>
          <b>{inr(stats?.earnings || 0)}</b>
          <small>Total Earnings</small>
        </div>
      </div>
      <div className="dash-grid">
        <div className="panel">
          <div className="section-head">
            <h2>Recent listings</h2>
            <Link to="/dashboard/listings">View All →</Link>
          </div>
          {listings.slice(0, 4).map((l) => (
            <div key={l.id} className="mini-row">
              <Cover listing={l} className="tiny" />
              <div>
                <strong>{l.name}</strong>
                <span>{l.uiStatus}</span>
              </div>
              <b>{inr(l.price)}</b>
            </div>
          ))}
        </div>
        <div className="panel">
          <div className="section-head">
            <h2>Latest offers</h2>
            <Link to="/dashboard/offers">View All →</Link>
          </div>
          {offers.slice(0, 4).map((o) => (
            <div key={o.id} className="mini-row">
              <div>
                <strong>{o.listingName}</strong>
                <span>{o.buyerName}</span>
              </div>
              <b>{inr(o.amount)}</b>
            </div>
          ))}
          {offers.length === 0 && <p className="empty">No offers yet.</p>}
        </div>
      </div>
    </SellerShell>
  );
}
