import React from 'react';
import { Link } from 'react-router-dom';
import { inr } from '../format.js';
import Cover from './Cover.jsx';
import { MARKET_TYPES, marketCardStats } from '../catalog.js';

export default function MarketCard({ listing, layout = 'grid' }) {
  const cfg = MARKET_TYPES[listing.type] || {};
  const stats = marketCardStats(listing);
  const blurb = listing.subtitle || String(listing.description || '').slice(0, 90);
  const accent = cfg.accent || 'market';

  return (
    <article className={`listing-card market-card is-${accent} ${layout === 'list' ? 'list-card' : ''}`}>
      <div className={`thumb ${accent} photo`}>
        <span className="badge">{cfg.badge || 'LISTING'}</span>
        <Cover listing={listing} />
      </div>
      <div className="listing-body">
        <h3>{listing.name}</h3>
        <p className="cat">{listing.category}</p>
        {layout === 'list' && blurb ? <p className="card-blurb">{blurb}</p> : null}
        <p className="ask">{inr(listing.price)}</p>
        <div className={`metrics ${layout === 'list' ? 'metrics-fill' : ''}`}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
        <Link className="view-btn" to={`/listing/${listing.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
