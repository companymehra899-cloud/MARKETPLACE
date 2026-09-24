import React from 'react';
import { Link } from 'react-router-dom';
import { inr } from '../format.js';
import Cover from './Cover.jsx';
import MarketCard from './MarketCard.jsx';
import { isMarketType } from '../catalog.js';

export default function ListingCard({ listing, filled, layout = 'grid' }) {
  if (isMarketType(listing.type)) {
    return <MarketCard listing={listing} layout={layout} />;
  }
  const isApp = listing.type === 'app';
  const traffic = String(listing.traffic || '');
  const visitors = traffic.includes('/') ? traffic : traffic ? `${traffic}/mo` : '—';
  const platform = listing.platform || listing.techStack?.[0] || (isApp ? 'Android' : 'Web');
  const extra = isApp ? listing.appSize || listing.minAndroid || '—' : listing.domainAge || '—';
  const extraLabel = isApp ? 'App Size' : 'Age';
  const reach = isApp ? listing.downloads || '—' : visitors;
  const reachLabel = isApp ? 'Downloads' : 'Monthly Visitors';
  const blurb = listing.subtitle || String(listing.description || '').slice(0, 90);

  return (
    <article className={`listing-card ${isApp ? 'is-app' : 'is-web'} ${layout === 'list' ? 'list-card' : ''}`}>
      <div className={`thumb ${isApp ? 'app' : 'web'} photo`}>
        <span className="badge">{isApp ? 'ANDROID APP' : 'WEBSITE'}</span>
        <Cover listing={listing} />
      </div>
      <div className="listing-body">
        <h3>{listing.name}</h3>
        <p className="cat">{listing.category}</p>
        {layout === 'list' && blurb ? <p className="card-blurb">{blurb}</p> : null}
        <p className="ask">{inr(listing.price)}</p>
        <div className={`metrics ${layout === 'list' ? 'metrics-fill' : ''}`}>
          <div>
            <strong>{reach}</strong>
            <span>{reachLabel}</span>
          </div>
          <div>
            <strong>{inr(listing.monthlyRevenue)}</strong>
            <span>Monthly Revenue</span>
          </div>
          {layout === 'list' && (
            <>
              <div>
                <strong>{extra}</strong>
                <span>{extraLabel}</span>
              </div>
              <div>
                <strong>{platform}</strong>
                <span>Platform</span>
              </div>
              <div>
                <strong>{listing.category}</strong>
                <span>Category</span>
              </div>
              <div>
                <strong>{listing.monetization || '—'}</strong>
                <span>Monetization</span>
              </div>
            </>
          )}
        </div>
        <Link className={`view-btn ${filled ? 'filled' : ''}`} to={`/listing/${listing.id}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
