import React from 'react';
import { Link } from 'react-router-dom';
import { inr } from '../format.js';
import Cover from './Cover.jsx';

export default function ListingCard({ listing, filled, layout = 'grid' }) {
  const isApp = listing.type === 'app';
  const traffic = String(listing.traffic || '');
  const visitors = traffic.includes('/') ? traffic : traffic ? `${traffic}/mo` : '—';

  return (
    <article className={`listing-card ${isApp ? 'is-app' : 'is-web'} ${layout === 'list' ? 'list-card' : ''}`}>
      <div className={`thumb ${isApp ? 'app' : 'web'} photo`}>
        <span className="badge">{isApp ? 'ANDROID APP' : 'WEBSITE'}</span>
        <Cover listing={listing} />
      </div>
      <div className="listing-body">
        <h3>{listing.name}</h3>
        <p className="cat">{listing.category}</p>
        <p className="ask">{inr(listing.price)}</p>
        <div className="metrics">
          <div>
            <strong>{isApp ? listing.downloads || '—' : visitors}</strong>
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
