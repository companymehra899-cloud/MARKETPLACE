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
  return source.slice(0, 2);
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

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
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
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setTab('overview');
    setShot(0);
    setLiked(false);
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

  async function save() {
    if (!user) {
      navigate('/login');
      return;
    }
    await api(`/api/watchlist/${id}`, { method: 'POST' });
    setLiked(true);
    setNote('Saved to watchlist.');
  }

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

  function share() {
    const url = window.location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    setNote('Link copied.');
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
  const views = listing.views || 320;
  const likes = (listing.likes || 28) + (liked ? 1 : 0);
  const chips = (listing.tags || listing.keyFeatures || []).slice(0, 4);
  const brand = (listing.name || 'Brand').split(' ')[0];
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
          <div className={`browser-frame ${isApp ? 'is-app' : ''}`}>
            <div className="browser-bar">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <div className="browser-url">
                <b>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#2563eb" strokeWidth="2">
                    <path d="M4 12h16M12 4l8 8-8 8" />
                  </svg>
                  {brand}
                </b>
                <span>Home</span>
                <span>Destinations</span>
                <span>Blog</span>
                <span>About</span>
                <em>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-3.5-3.5" />
                  </svg>
                </em>
              </div>
            </div>
            <div className="browser-hero">
              {currentShot ? <img src={currentShot} alt={listing.name} /> : <Cover listing={listing} />}
              <div className="browser-copy">
                <h3>{isApp ? listing.name : 'Explore the World'}</h3>
                <p>{listing.subtitle || 'Discover amazing places, travel guides and useful tips.'}</p>
                <button type="button">{isApp ? 'Install App' : 'Start Exploring'}</button>
              </div>
            </div>
          </div>
          <div className="ld-thumbs two">
            {photos.map((src, i) => (
              <button key={src} className={shot === i ? 'on' : ''} type="button" onClick={() => setShot(i)}>
                <img src={src} alt={`${listing.name} preview ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="ld-info">
          <span className={`type-pill ${isApp ? 'app' : ''}`}>{typeLabel(listing.type)}</span>
          <h1>{listing.name}</h1>
          <p className="ld-sub">{listing.subtitle || listing.description}</p>
          <div className="ld-stats">
            <span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3" />
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
              </svg>
              {views}
            </span>
            <button type="button" className={liked ? 'on' : ''} onClick={save}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : '#64748b'} strokeWidth="1.8">
                <path d="M12 21s-7-4.6-9.5-8.2C.4 9.8 2.2 6 6 6c2 0 3.2 1 4 2 0.8-1 2-2 4-2 3.8 0 5.6 3.8 3.5 6.8C19 16.4 12 21 12 21z" />
              </svg>
              {likes}
            </button>
            <button type="button" onClick={share}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" strokeWidth="1.8">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
              </svg>
              Share
            </button>
          </div>
          <div className="ld-highlights">
            <div>
              <span className="hi-ico">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M8 20h8M12 16v4" />
                </svg>
              </span>
              <b>Responsive</b>
              <small>Design</small>
            </div>
            <div>
              <span className="hi-ico">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 4v2M12 18v2M4 12h2M18 12h2" />
                </svg>
              </span>
              <b>Modern</b>
              <small>UI</small>
            </div>
            <div>
              <span className="hi-ico">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="1.8">
                  <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
                </svg>
              </span>
              <b>Fast</b>
              <small>Loading</small>
            </div>
          </div>
          <dl className="ld-meta">
            <div>
              <dt>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9c-2.5-3-4-6-4-9s1.5-6 4-9z" />
                </svg>
                Platform
              </dt>
              <dd>{listing.platform || (isApp ? 'Android' : 'Web')}</dd>
            </div>
            <div>
              <dt>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <rect x="4" y="4" width="7" height="7" rx="1" />
                  <rect x="13" y="4" width="7" height="7" rx="1" />
                  <rect x="4" y="13" width="7" height="7" rx="1" />
                  <rect x="13" y="13" width="7" height="7" rx="1" />
                </svg>
                Category
              </dt>
              <dd>{listing.category}</dd>
            </div>
            <div>
              <dt>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <rect x="3" y="5" width="18" height="16" rx="2" />
                  <path d="M8 3v4M16 3v4M3 10h18" />
                </svg>
                Listed on
              </dt>
              <dd>{listing.listedOn || formatDate(listing.createdAt)}</dd>
            </div>
            <div>
              <dt>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <path d="M12 3l7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7l7-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                Last Updated
              </dt>
              <dd>{listing.lastUpdated || formatDate(listing.createdAt)}</dd>
            </div>
          </dl>
        </div>

        <aside className="ld-buy">
          <p className="ask-lg">{inr(listing.price)}</p>
          <button className="btn btn-primary full offer-btn" type="button" onClick={contact}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
            Message / Contact Seller
          </button>
          <Link to="/dashboard/messages" className="seller-mini" onClick={contact}>
            <span className="avatar">{initials(listing.seller?.name).slice(0, 1)}</span>
            <span>
              <strong>{listing.seller?.name}</strong>
              {listing.seller?.verified && (
                <em>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="#2563eb">
                    <path d="M12 2l2.4 2.2 3.2-.4 1.2 3 2.8 1.6-1.2 3 .8 3.1-3 1.2-1.6 2.8-3-1.2-3.1.8-1.2-3-2.8-1.6 1.2-3-.8-3.1 3-1.2 1.6-2.8L12 2z" />
                    <path d="M8.8 12.2l2.1 2.1 4.3-4.4" fill="none" stroke="#fff" strokeWidth="1.8" />
                  </svg>
                  Verified Seller
                </em>
              )}
            </span>
            <b>›</b>
          </Link>
          <ul className="trust-mini">
            <li>
              <span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.8">
                  <path d="M12 3l8 4v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </span>
              Safe &amp; Secure Deal
            </li>
            <li>
              <span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.8">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <path d="M3 10h18" />
                </svg>
              </span>
              Secure Payments
            </li>
            <li>
              <span>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="1.8">
                  <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
                  <rect x="2" y="14" width="5" height="6" rx="1" />
                  <rect x="17" y="14" width="5" height="6" rx="1" />
                </svg>
              </span>
              Support Available
            </li>
          </ul>
        </aside>
      </div>

      <div className="ld-tabs">
        {[
          ['overview', 'Overview'],
          ['screenshots', 'Screenshots'],
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

      {tab === 'screenshots' && (
        <section className="ld-about">
          <h2>Screenshots</h2>
          <div className="shot-grid">
            {photos.map((src, i) => (
              <button key={src} type="button" onClick={() => setShot(i)}>
                <img src={src} alt={`${listing.name} screenshot ${i + 1}`} />
              </button>
            ))}
          </div>
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
