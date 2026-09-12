import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { inr, typeLabel } from '../format.js';
import { useAuth } from '../context/AuthContext.jsx';
import Cover from '../components/Cover.jsx';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WEB_GALLERIES = {
  travel: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1400&q=70',
  ],
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=70',
  ],
  plants: [
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=1400&q=70',
  ],
  taskflow: [
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=70',
  ],
  aitify: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=70',
  ],
  newsportal: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1504711334963-8a0fb3754c35?auto=format&fit=crop&w=1400&q=70',
  ],
  studynest: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=70',
  ],
  finflow: [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7231a3?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1400&q=70',
  ],
  generic: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1400&q=70',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=70',
  ],
};

function listingPhotos(listing) {
  const uploaded = (listing.screenshots || []).filter(Boolean);
  if (uploaded.length) return uploaded;
  return WEB_GALLERIES[listing.cover] || WEB_GALLERIES.generic;
}

function initials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [offerOpen, setOfferOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [shot, setShot] = useState(0);

  useEffect(() => {
    setTab('overview');
    setShot(0);
    api(`/api/listings/${id}`)
      .then((d) => {
        setListing(d.listing);
        setAmount(d.listing.price);
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

  const series = listing?.monthlySeries || [4, 5, 6, 6, 7, 8, 9, 11, 13, 16, 17, 18];
  const max = Math.max(...series, 1);

  async function submitOffer(e) {
    e.preventDefault();
    setNote('');
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api(`/api/listings/${id}/offers`, {
        method: 'POST',
        body: JSON.stringify({ amount, message }),
      });
      setNote('Offer sent to the seller.');
      setOfferOpen(false);
      setMessage('');
    } catch (err) {
      setNote(err.message);
    }
  }

  async function save() {
    if (!user) {
      navigate('/login');
      return;
    }
    await api(`/api/watchlist/${id}`, { method: 'POST' });
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

  if (error) {
    return (
      <div className="detail-page">
        <p className="error">{error}</p>
      </div>
    );
  }
  if (!listing) return <p className="page-loading">Loading listing...</p>;

  const isApp = listing.type === 'app';
  const title = listing.titleExtra || listing.name;
  const photos = listingPhotos(listing);
  const currentShot = photos[shot] || photos[0];
  const maxShot = Math.max(0, photos.length - 1);

  return (
    <div className="detail-page">
      <div className="crumbs">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={isApp ? '/apps' : '/websites'}>{isApp ? 'Android Apps' : 'Websites'}</Link>
        <span>›</span>
        <Link to={isApp ? `/apps?category=${encodeURIComponent(listing.category)}` : `/websites?category=${encodeURIComponent(listing.category)}`}>
          {listing.category}
        </Link>
        <span>›</span>
        <b>{listing.name}</b>
      </div>

      <div className="detail-layout">
        <div>
          <header className="ld-head">
            <div className={`ld-icon ${isApp ? 'app' : 'web'}`}>{isApp ? 'SM' : 'WB'}</div>
            <div className="ld-titles">
              <h1>{title}</h1>
              <p>{listing.subtitle || listing.description}</p>
              <div className="ld-tags">
                <span>{typeLabel(listing.type)}</span>
                <span>{listing.category}</span>
                {listing.seller?.verified && <em>Verified Listing</em>}
                <small>Listed {listing.listedOn || 'recently'}</small>
              </div>
            </div>
            <div className="ld-head-actions">
              <button type="button" onClick={save}>♡ Save</button>
              <button type="button">↗ Share</button>
            </div>
          </header>

          <div className={`gallery ${isApp ? '' : 'photo-gallery'}`}>
            {photos.length > 1 && (
              <button className="gal-nav" type="button" onClick={() => setShot((s) => (s === 0 ? maxShot : s - 1))}>
                ‹
              </button>
            )}
            {isApp ? (
              <div className="stage app-stage">
                <div className="ld-phone left">
                  <div className="ph-top">9:41</div>
                  <div className="ph-body">
                    <b>{listing.name}</b>
                    <h3>{listing.subtitle || listing.name}</h3>
                  </div>
                </div>
                <div className="mid-copy">
                  <h2>{listing.name}</h2>
                  <p>{listing.subtitle}</p>
                  <ul>
                    {(listing.keyFeatures || []).slice(0, 4).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <div className="ld-phone right">
                  <Cover listing={listing} />
                </div>
              </div>
            ) : (
              <div className="web-photo">
                <img src={currentShot} alt={`${listing.name} screenshot ${shot + 1}`} />
                <div className="web-photo-caption">
                  <b>{listing.name}</b>
                  <small>{listing.subtitle}</small>
                </div>
              </div>
            )}
            {photos.length > 1 && (
              <button className="gal-nav" type="button" onClick={() => setShot((s) => (s === maxShot ? 0 : s + 1))}>
                ›
              </button>
            )}
          </div>

          {!isApp && photos.length > 1 && (
            <div className="thumbs photo-thumbs">
              {photos.map((src, i) => (
                <button key={src} className={shot === i ? 'on' : ''} type="button" onClick={() => setShot(i)}>
                  <img src={src} alt={`${listing.name} preview ${i + 1}`} />
                </button>
              ))}
            </div>
          )}

          <div className="ld-tabs">
            {['overview', 'features', 'revenue', 'technology', 'included', 'faqs', 'reviews'].map((t) => (
              <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
                {t === 'revenue' ? 'Revenue & Analytics' : t === 'included' ? "What's Included" : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <section className="ld-block">
              <h2>Overview</h2>
              <p>{listing.description}</p>
            </section>
          )}

          {tab === 'features' && (
            <section className="ld-block">
              <h2>Features</h2>
              <div className="split">
                <div>
                  <h3>Key Features</h3>
                  <ul className="checks">
                    {(listing.keyFeatures || []).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
                <aside className="why">
                  <h3>Why I'm Selling?</h3>
                  <p>{listing.whySelling}</p>
                </aside>
              </div>
            </section>
          )}

          {tab === 'revenue' && (
            <section className="ld-block">
              <h2>Revenue & Analytics</h2>
              <div className="rev-grid">
                <div className="chart">
                  <h3>Monthly Revenue (Last 12 Months)</h3>
                  <div className="bars">
                    {series.map((v, i) => (
                      <div key={MONTHS[i]}>
                        <i style={{ height: `${(v / max) * 120}px` }} />
                        <small>{MONTHS[i]}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ustats">
                  <h3>User Statistics</h3>
                  <p>
                    <b>{listing.userStats?.downloads || listing.downloads || listing.traffic}</b>
                    <span>{isApp ? 'Total Downloads' : 'Monthly Visitors'}</span>
                  </p>
                  <p>
                    <b>{listing.userStats?.users || '—'}</b>
                    <span>Active Users</span>
                  </p>
                  <p>
                    <b>{listing.userStats?.rating || listing.rating}</b>
                    <span>Average Rating</span>
                  </p>
                  <p>
                    <b>{listing.userStats?.retention || '—'}</b>
                    <span>Retention Rate</span>
                  </p>
                </div>
              </div>
            </section>
          )}

          {tab === 'technology' && (
            <section className="ld-block">
              <h2>Technology</h2>
              <div className="tech">
                {(listing.techStack || []).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </section>
          )}

          {tab === 'included' && (
            <section className="ld-block">
              <h2>What's Included</h2>
              <p>{listing.included}</p>
              {listing.support && <p>Support: {listing.support}</p>}
            </section>
          )}

          {tab === 'faqs' && (
            <section className="ld-block">
              <h2>Faqs</h2>
              <p>Is the source, domain, or Play Console access included in the asking price?</p>
              <p>Yes. Transfer details are shared after the deal is confirmed.</p>
              <p>Can I request extra documents?</p>
              <p>Yes. Use Contact Seller for traffic, revenue, and ownership proof.</p>
            </section>
          )}

          {tab === 'reviews' && (
            <section className="ld-block">
              <h2>Reviews</h2>
              <p>
                ★ {listing.rating}/5 from {listing.reviews} reviews
              </p>
            </section>
          )}
        </div>

        <aside className="ld-side">
          <div className="price-card">
            <small>Price</small>
            <p className="ask-lg">{inr(listing.price)}</p>
            <button className="btn btn-primary full" type="button" onClick={() => setOfferOpen(true)}>
              Make an Offer
            </button>
            <button className="ghost-btn full" type="button" onClick={contact}>
              Contact Seller
            </button>
            <ul className="spec">
              <li>
                <span>{isApp ? 'Downloads' : 'Monthly Visitors'}</span>
                <b>{isApp ? listing.downloads : listing.traffic}</b>
              </li>
              <li>
                <span>Rating</span>
                <b>
                  ★ {listing.rating}/5 ({listing.reviews} reviews)
                </b>
              </li>
              <li>
                <span>Monthly Revenue</span>
                <b>{inr(listing.monthlyRevenue)}</b>
              </li>
              <li>
                <span>Category</span>
                <b>{listing.category}</b>
              </li>
              <li>
                <span>Last Updated</span>
                <b>{listing.lastUpdated}</b>
              </li>
              {isApp ? (
                <>
                  <li>
                    <span>App Size</span>
                    <b>{listing.appSize}</b>
                  </li>
                  <li>
                    <span>Minimum Android</span>
                    <b>{listing.minAndroid}</b>
                  </li>
                </>
              ) : (
                <li>
                  <span>Domain Age</span>
                  <b>{listing.domainAge}</b>
                </li>
              )}
              <li>
                <span>Language</span>
                <b>{listing.language}</b>
              </li>
              <li>
                <span>Monetization</span>
                <b>{listing.monetization}</b>
              </li>
              <li>
                <span>What's Included</span>
                <b>{listing.included}</b>
              </li>
              <li>
                <span>Support</span>
                <b>{listing.support}</b>
              </li>
            </ul>
          </div>

          <div className="seller-card">
            <h3>Seller Information</h3>
            <div className="seller-row">
              <span className="avatar lg">{initials(listing.seller?.name)}</span>
              <div>
                <strong>{listing.seller?.name}</strong>
                {listing.seller?.verified && <em>Verified Seller</em>}
                <small>
                  Member since{' '}
                  {listing.seller?.createdAt
                    ? new Date(listing.seller.createdAt).toLocaleString('en-IN', { month: 'short', year: 'numeric' })
                    : '2022'}
                </small>
                <small>
                  ★ {listing.seller?.rating} ({listing.seller?.reviews} reviews)
                </small>
              </div>
            </div>
            <button className="ghost-btn full" type="button" onClick={contact}>
              Send Message
            </button>
          </div>

          <div className="trust-card">
            <p>
              <b>Safe & Secure Transactions</b>
              <span>We ensure a secure buying process.</span>
            </p>
            <p>
              <b>Verified Listings</b>
              <span>All listings are manually reviewed.</span>
            </p>
            <p>
              <b>Direct Communication</b>
              <span>Talk directly with the seller.</span>
            </p>
          </div>

          {similar.length > 0 && (
            <div className="similar">
              <div className="section-head">
                <h3>Similar {isApp ? 'Android Apps' : 'Websites'}</h3>
                <Link to={isApp ? '/apps' : '/websites'}>View All →</Link>
              </div>
              {similar.map((l) => (
                <Link key={l.id} className="sim-row" to={`/listing/${l.id}`}>
                  <span className={`sim-ico ${l.cover || ''}`}>{initials(l.name)}</span>
                  <div>
                    <strong>{l.name}</strong>
                    <small>
                      {l.category} · ★ {l.rating}
                    </small>
                  </div>
                  <b>{inr(l.price)}</b>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>

      {offerOpen && (
        <div className="modal" onClick={() => setOfferOpen(false)}>
          <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={submitOffer}>
            <h3>Make an Offer</h3>
            <label>Amount (INR)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <label>Message</label>
            <textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="btn btn-primary full" type="submit">
              Send Offer
            </button>
          </form>
        </div>
      )}
      {note && <div className="toast">{note}</div>}
    </div>
  );
}
