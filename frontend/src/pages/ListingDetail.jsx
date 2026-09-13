import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { inr, typeLabel } from '../format.js';
import { useAuth } from '../context/AuthContext.jsx';
import Cover from '../components/Cover.jsx';

const WEB_GALLERIES = {
  travel: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=70',
  ],
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=70',
  ],
  plants: [
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1466692476866-aef1dfb1e735?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1400&q=70',
  ],
  taskflow: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=70',
  ],
  aitify: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=70',
  ],
  newsportal: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1504711334963-8a0fb3754c35?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1432821596592-e9c04d5b1ebc?auto=format&fit=crop&w=1400&q=70',
  ],
  studynest: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1456513080800-7d93d4e8524d?auto=format&fit=crop&w=1400&q=70',
  ],
  finflow: [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7231a3?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=1400&q=70',
  ],
  generic: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=70',
  ],
};

const SIMILAR_PHOTOS = {
  default: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=70',
  food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=70',
  plants: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=400&q=70',
  taskflow: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=70',
  aitify: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=70',
  newsportal: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=70',
  studynest: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=70',
  finflow: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=70',
  travel: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=70',
};

function listingPhotos(listing) {
  const uploaded = (listing.screenshots || []).filter(Boolean);
  const source = uploaded.length ? uploaded : WEB_GALLERIES[listing.cover] || WEB_GALLERIES.generic;
  return source.slice(0, 4);
}

function similarPhoto(listing) {
  const uploaded = (listing.screenshots || []).filter(Boolean)[0];
  if (uploaded) return uploaded;
  return SIMILAR_PHOTOS[listing.cover] || SIMILAR_PHOTOS.default;
}

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function memberSince(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function MetricIcon({ name }) {
  const common = { viewBox: '0 0 24 24', width: '22', height: '22', fill: 'none', stroke: '#64748b', strokeWidth: '1.7' };
  if (name === 'chart') {
    return (
      <svg {...common}>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19V8" />
      </svg>
    );
  }
  if (name === 'users') {
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19c.6-3.2 2.8-5 6-5s5.4 1.8 6 5" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M16.2 14.2c2.2.4 3.8 2 4.3 4.8" />
      </svg>
    );
  }
  if (name === 'cal') {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </svg>
    );
  }
  if (name === 'plat') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.6 3.2 4 6.2 4 9s-1.4 5.8-4 9c-2.6-3.2-4-6.2-4-9s1.4-5.8 4-9z" />
      </svg>
    );
  }
  if (name === 'folder') {
    return (
      <svg {...common}>
        <path d="M3 7h6l2 2h10v10H3z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
    </svg>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [note, setNote] = useState('');
  const [shot, setShot] = useState(0);

  useEffect(() => {
    setTab('overview');
    setShot(0);
    api(`/api/listings/${id}`)
      .then((d) => {
        setListing(d.listing);
      })
      .catch((e) => setError(e.message));
    api('/api/listings')
      .then((d) => setRelated((d.listings || []).filter((l) => l.id !== id)))
      .catch(() => {});
  }, [id]);

  const similar = useMemo(() => {
    if (!listing) return [];
    return related.filter((l) => l.type === listing.type && l.id !== listing.id).slice(0, 4);
  }, [related, listing]);

  async function contact() {
    if (!user) {
      navigate('/login');
      return;
    }
    await api('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ listingId: id, text: 'Hi, I am interested in this listing.' }),
    });
    setNote('Message sent to the seller.');
  }

  if (error) {
    return (
      <div className="detail-page">
        <p className="error">{error}</p>
      </div>
    );
  }
  if (!listing) return <p className="page-loading">Loading listing...</p>;

  const isApp = listing.type === 'app';
  const photos = listingPhotos(listing);
  const currentShot = photos[shot] || photos[0];
  const chips = (listing.tags || listing.keyFeatures || []).slice(0, 4);
  const crumbCat = listing.category?.split('&')[0]?.trim() || listing.category;

  return (
    <div className="detail-page">
      <div className="crumbs">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={isApp ? '/apps' : '/websites'}>{isApp ? 'Android Apps' : 'Websites'}</Link>
        <span>›</span>
        <Link to={isApp ? `/apps?category=${encodeURIComponent(listing.category)}` : `/websites?category=${encodeURIComponent(listing.category)}`}>
          {crumbCat}
        </Link>
        <span>›</span>
        <em>{listing.name}</em>
      </div>

      <div className="ld-top">
        <div className="ld-preview">
          <div className={`ld-gallery ${isApp ? 'is-app' : ''}`}>
            <div className="ld-main-shot">
              {currentShot ? <img src={currentShot} alt={listing.name} /> : <Cover listing={listing} />}
              {photos.length > 1 && (
                <>
                  <button
                    className="ld-nav prev"
                    type="button"
                    onClick={() => setShot((s) => (s - 1 + photos.length) % photos.length)}
                    aria-label="Previous screenshot"
                  >
                    ‹
                  </button>
                  <button
                    className="ld-nav next"
                    type="button"
                    onClick={() => setShot((s) => (s + 1) % photos.length)}
                    aria-label="Next screenshot"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="ld-thumbs">
            {photos.map((src, i) => (
              <button key={`${src}-${i}`} className={shot === i ? 'on' : ''} type="button" onClick={() => setShot(i)}>
                <img src={src} alt={`${listing.name} preview ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="ld-info">
          <span className={`type-pill ${isApp ? 'app' : ''}`}>{typeLabel(listing.type)}</span>
          <h1>{listing.name}</h1>
          <p className="ld-sub">{listing.subtitle || listing.description}</p>
          <div className="ld-price-row">
            <b>{inr(listing.price)}</b>
            <em>Negotiable</em>
          </div>
          <div className="ld-metrics">
            <div className="ld-metric">
              <span className="ld-metric-ico">
                <MetricIcon name="chart" />
              </span>
              <small>Monthly Revenue</small>
              <strong>{listing.monthlyRevenue ? inr(listing.monthlyRevenue) : '—'}</strong>
            </div>
            <div className="ld-metric">
              <span className="ld-metric-ico">
                <MetricIcon name="users" />
              </span>
              <small>{isApp ? 'Downloads' : 'Monthly Visitors'}</small>
              <strong>{isApp ? listing.downloads || '—' : listing.traffic || '—'}</strong>
            </div>
            <div className="ld-metric">
              <span className="ld-metric-ico">
                <MetricIcon name="cal" />
              </span>
              <small>{isApp ? 'App Size' : 'Age'}</small>
              <strong>{isApp ? listing.appSize || '—' : listing.domainAge || '—'}</strong>
            </div>
            <div className="ld-metric">
              <span className="ld-metric-ico">
                <MetricIcon name="plat" />
              </span>
              <small>Platform</small>
              <strong>{listing.platform || listing.techStack?.[0] || (isApp ? 'Android' : 'Web')}</strong>
            </div>
            <div className="ld-metric">
              <span className="ld-metric-ico">
                <MetricIcon name="folder" />
              </span>
              <small>Category</small>
              <strong>{listing.category}</strong>
            </div>
            <div className="ld-metric">
              <span className="ld-metric-ico">
                <MetricIcon name="shield" />
              </span>
              <small>Monetization</small>
              <strong>{listing.monetization || '—'}</strong>
            </div>
          </div>
        </div>

        <aside className="ld-buy">
          <h3>Connect With Seller</h3>
          <button className="btn btn-primary full offer-btn" type="button" onClick={contact}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 6h16v12H4z" />
              <path d="M4 7l8 6 8-6" />
            </svg>
            Send Contact Request
          </button>
          <div className="ld-seller-card">
            <h4>Seller Information</h4>
            <div className="ld-seller-row">
              <span className="avatar lg">{initials(listing.seller?.name).slice(0, 1)}</span>
              <span>
                <strong>{listing.seller?.name || 'Seller'}</strong>
                <small>Member since {memberSince(listing.seller?.createdAt)}</small>
              </span>
            </div>
            <div className="ld-seller-counts">
              <div>
                <b>{listing.seller?.listingCount ?? 0}</b>
                <small>Total Listings</small>
              </div>
              <div>
                <b>{listing.seller?.activeListings ?? 0}</b>
                <small>Active Listings</small>
              </div>
            </div>
            <Link to="/dashboard/messages" className="ld-view-profile" onClick={contact}>
              View Profile
            </Link>
          </div>
        </aside>
      </div>

      <div className="ld-tabs">
        {[
          ['overview', 'Overview'],
          ['preview', 'Demo/Live Preview'],
          ['technology', 'Tech Details'],
          ...(!isApp ? [['website', 'Website Info']] : []),
        ].map(([key, label]) => (
          <button key={key} className={tab === key ? 'on' : ''} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <section className="ld-about">
          <h2>About This {isApp ? 'App' : 'Website'}</h2>
          <p>{listing.description}</p>
          <div className="ld-chips">
            {(chips.length ? chips : [crumbCat, isApp ? 'App' : 'Blog', 'Responsive', 'Easy to Customize']).map((c, i) => (
              <span key={c} className={`chip-${i % 4}`}>{c}</span>
            ))}
          </div>
        </section>
      )}

      {tab === 'preview' && (
        <section className="ld-about">
          <h2>Demo/Live Preview</h2>
          {listing.liveUrl ? (
            <p>
              <a href={listing.liveUrl} target="_blank" rel="noreferrer">
                {listing.liveUrl}
              </a>
            </p>
          ) : (
            <p>No live preview listed yet.</p>
          )}
        </section>
      )}

      {tab === 'website' && !isApp && (
        <section className="ld-about">
          <h2>Website Info</h2>
          <dl className="ld-meta site-info">
            <div>
              <dt>Live URL</dt>
              <dd>
                {listing.liveUrl ? (
                  <a href={listing.liveUrl} target="_blank" rel="noreferrer">
                    {listing.liveUrl}
                  </a>
                ) : (
                  'Not listed as live'
                )}
              </dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>{listing.platform || 'Web'}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{listing.category}</dd>
            </div>
            <div>
              <dt>Monthly visitors</dt>
              <dd>{listing.traffic || '—'}</dd>
            </div>
          </dl>
        </section>
      )}

      {tab === 'technology' && (
        <section className="ld-about">
          <h2>Tech Details</h2>
          <div className="tech">
            {(listing.techStack || [listing.platform || 'Web']).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          {listing.included && <p>Included: {listing.included}</p>}
          {listing.support && <p>Support: {listing.support}</p>}
        </section>
      )}

      {similar.length > 0 && (
        <section className="similar-strip">
          <div className="similar-head">
            <h3>Similar Listings</h3>
            <Link to={isApp ? '/apps' : '/websites'}>View All →</Link>
          </div>
          <div className="similar-grid">
            {similar.map((l) => (
              <Link key={l.id} className="sim-card" to={`/listing/${l.id}`}>
                <img src={similarPhoto(l)} alt={l.name} />
                <div>
                  <strong>{l.name}</strong>
                  <small>{typeLabel(l.type)}</small>
                  <b>{inr(l.price)}</b>
                </div>
                <span className="heart" aria-hidden="true">♡</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {note && <div className="toast">{note}</div>}
    </div>
  );
}
