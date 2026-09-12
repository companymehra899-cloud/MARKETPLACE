import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { inr } from '../format.js';
import SellerShell from '../components/SellerShell.jsx';
import Cover from '../components/Cover.jsx';

const TABS = [
  { id: 'all', label: 'All Listings' },
  { id: 'approved', label: 'Active' },
  { id: 'pending', label: 'Under Review' },
  { id: 'sold', label: 'Sold' },
  { id: 'draft', label: 'Drafts' },
];

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState('latest');

  function load() {
    api('/api/my/listings').then((d) => {
      setListings(d.listings || []);
      setStats(d.stats || null);
    });
  }

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    let items = listings;
    if (tab !== 'all') items = items.filter((l) => l.status === tab);
    if (sort === 'price') items = [...items].sort((a, b) => b.price - a.price);
    return items;
  }, [listings, tab, sort]);

  async function duplicate(id) {
    try {
      await api(`/api/listings/${id}/duplicate`, { method: 'POST' });
      load();
    } catch (err) {
      window.alert(err.message);
    }
  }

  const counts = {
    all: stats?.total || 0,
    approved: stats?.active || 0,
    pending: stats?.review || 0,
    sold: stats?.sold || 0,
    draft: stats?.drafts || 0,
  };

  return (
    <SellerShell stats={stats}>
      <div className="ml-head">
        <div>
          <h1>My Listings</h1>
          <p>Manage your website and Android app listings, view offers and track performance.</p>
        </div>
        {stats?.listingLimit != null && stats.listingCount >= stats.listingLimit ? (
          <span className="btn btn-outline" aria-disabled="true">
            Free limit reached ({stats.listingCount}/{stats.listingLimit})
          </span>
        ) : (
          <Link className="btn btn-primary" to="/sell">
            + Add New Listing
          </Link>
        )}
      </div>

      <div className="ml-stats">
        <div>
          <span className="dot blue" />
          <b>{counts.all}</b>
          <small>Total Listings</small>
        </div>
        <div>
          <span className="dot green" />
          <b>{counts.approved}</b>
          <small>Active</small>
        </div>
        <div>
          <span className="dot orange" />
          <b>{counts.pending}</b>
          <small>Under Review</small>
        </div>
        <div>
          <span className="dot red" />
          <b>{counts.sold}</b>
          <small>Sold</small>
        </div>
        <div className="earn">
          <span className="dot purple">₹</span>
          <b>{inr(stats?.earnings || 0)}</b>
          <small>Total Earnings</small>
        </div>
      </div>

      <div className="ml-tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label} ({counts[t.id] || 0})
          </button>
        ))}
        <label className="sort">
          Sort by:
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest Added</option>
            <option value="price">Price</option>
          </select>
        </label>
      </div>

      <div className="ml-list">
        {visible.map((l) => {
          const isApp = l.type === 'app';
          const sold = l.status === 'sold';
          return (
            <article key={l.id} className="ml-row">
              <Cover listing={l} />
              <div className="ml-info">
                <h3>{l.name}</h3>
                <p className="meta">
                  <span>{isApp ? 'Android App' : 'Website'}</span>
                  <em>{l.category}</em>
                </p>
                <div className="ml-metrics">
                  {isApp ? (
                    <>
                      <span>
                        <b>{l.downloads}</b>
                        <small>Downloads</small>
                      </span>
                      <span>
                        <b>{l.appSize}</b>
                        <small>App Size</small>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        <b>{l.traffic}</b>
                        <small>Monthly Visitors</small>
                      </span>
                      <span>
                        <b>{inr(l.monthlyRevenue)}</b>
                        <small>Monthly Revenue</small>
                      </span>
                      <span>
                        <b>{l.domainAge}</b>
                        <small>Domain Age</small>
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="ml-price">
                <strong>{inr(l.price)}</strong>
                <span className={`st ${l.status}`}>{l.uiStatus}</span>
                <small>Listed on {l.listedOn}</small>
              </div>
              <div className="ml-actions">
                {sold ? (
                  <>
                    <Link className="ghost-btn" to={`/listing/${l.id}`}>
                      View
                    </Link>
                    <button className="ghost-btn" type="button" onClick={() => duplicate(l.id)}>
                      Duplicate
                    </button>
                  </>
                ) : (
                  <>
                    <Link className="ghost-btn" to={`/sell/${l.id}`}>
                      Edit
                    </Link>
                    <Link className="ghost-btn" to={`/listing/${l.id}`}>
                      View
                    </Link>
                  </>
                )}
                <button className="more" type="button">
                  ···
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </SellerShell>
  );
}
