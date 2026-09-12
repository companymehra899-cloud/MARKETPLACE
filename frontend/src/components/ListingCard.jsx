import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { inr } from '../format.js';
import Cover from './Cover.jsx';

export default function ListingCard({ listing, filled, layout = 'grid' }) {
  const isApp = listing.type === 'app';
  const [saved, setSaved] = useState(false);
  const visitors = `${listing.traffic}${String(listing.traffic || '').includes('/') ? '' : '/mo'}`;

  return (
    <article className={`listing-card ${isApp ? 'is-app' : 'is-web'} ${layout === 'list' ? 'list-card' : ''}`}>
      <div className={`thumb ${isApp ? 'app' : 'web'} photo`}>
        <button
          className={`heart ${saved ? 'on' : ''}`}
          type="button"
          aria-label="Save"
          onClick={(e) => {
            e.preventDefault();
            setSaved((v) => !v);
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? '#ef4444' : 'none'} stroke={saved ? '#ef4444' : '#94a3b8'} strokeWidth="1.8">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        </button>
        <Cover listing={listing} />
      </div>
      <div className="listing-body">
        <h3>{listing.name}</h3>
        <p className="cat">{listing.category}</p>
        {isApp ? (
          <div className="metrics metrics-3">
            <div>
              <strong>
                <span className="m-ico cubes" />
                {listing.downloads}
              </strong>
              <span>Downloads</span>
            </div>
            <div>
              <strong>
                <span className="m-ico star" />
                {listing.rating}
              </strong>
              <span>Rating</span>
            </div>
            <div>
              <strong>
                <span className="m-ico rupee" />
                {inr(listing.monthlyRevenue)}
              </strong>
              <span>Revenue/mo</span>
            </div>
          </div>
        ) : (
          <div className="metrics">
            <div>
              <strong>
                <span className="m-ico cubes" />
                {visitors}
              </strong>
              <span>Visitors</span>
            </div>
            <div>
              <strong>
                <span className="m-ico rupee" />
                {inr(listing.monthlyRevenue)}
              </strong>
              <span>Revenue</span>
            </div>
          </div>
        )}
        <p className="ask">{inr(listing.price)}</p>
        <Link className={`view-btn ${filled ? 'filled' : ''}`} to={`/listing/${listing.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
