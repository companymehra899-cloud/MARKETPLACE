import React from 'react';
import { Link } from 'react-router-dom';
import { inr } from '../format.js';
import Cover from './Cover.jsx';

export default function ListingCard({ listing, filled }) {
  const isApp = listing.type === 'app';
  return (
    <article className={`listing-card ${isApp ? 'is-app' : 'is-web'}`}>
      <div className={`thumb ${isApp ? 'app' : 'web'} photo`}>
        <span className="badge">{isApp ? 'ANDROID APP' : 'WEBSITE'}</span>
        <button className="heart" type="button" aria-label="Save">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="1.8">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        </button>
        <Cover listing={listing} />
      </div>
      <div className="listing-body">
        <h3>{listing.name}</h3>
        <p className="cat">{listing.category}</p>
        <p className="ask">{inr(listing.price)}</p>
        <div className="metrics">
          <div>
            <strong>{isApp ? listing.downloads : `${listing.traffic}${String(listing.traffic || '').includes('/') ? '' : '/mo'}`}</strong>
            <span>{isApp ? 'Downloads' : 'Monthly Visitors'}</span>
          </div>
          <div>
            <strong>{inr(listing.monthlyRevenue)}</strong>
            <span>Monthly Revenue</span>
          </div>
        </div>
        <Link className={`view-btn ${filled ? 'filled' : ''}`} to={`/listing/${listing.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
