import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { inr, typeLabel } from '../format.js';
import { useAuth } from '../context/AuthContext.jsx';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

          <div className="gallery">
            <button className="gal-nav" type="button" onClick={() => setShot((s) => Math.max(0, s - 1))}>
              ‹
            </button>
            <div className={`stage ${isApp ? 'app-stage' : 'web-stage'}`}>
              {isApp ? (
                <>
                  <div className="ld-phone left">
                    <div className="ph-top">9:41</div>
                    <div className="ph-body">
                      <b>Study Master</b>
                      <h3>Learn Today Build Your Tomorrow</h3>
                      <div className="tiles">
                        <i>Mock Tests</i>
                        <i>Study Notes</i>
                        <i>Current Affairs</i>
                        <i>Previous Papers</i>
                      </div>
                    </div>
                  </div>
                  <div className="mid-copy">
                    <h2>Your Complete Exam Preparation Partner</h2>
                    <p>Practice. Learn. Improve. Succeed.</p>
                    <ul>
                      <li>10,000+ Practice Questions</li>
                      <li>Detailed Performance Analysis</li>
                      <li>Study Notes & Current Affairs</li>
                      <li>Multiple Exam Categories</li>
                    </ul>
                    <div className="play-badge">GET IT ON Google Play</div>
                  </div>
                  <div className="ld-phone right">
                    <div className="ph-top">9:41</div>
                    <div className="ph-body quiz">
                      <b>Mock Test</b>
                      <small>Question 1 of 100</small>
                      <p>What is the value of 15% of 240?</p>
                      <span>A 30</span>
                      <span>B 36</span>
                      <span>C 48</span>
                      <span>D 40</span>
                      <button type="button">Next Question</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="web-stage-inner">
                  <h2>{listing.name}</h2>
                  <p>{listing.subtitle}</p>
                </div>
              )}
            </div>
            <button className="gal-nav" type="button" onClick={() => setShot((s) => s + 1)}>
              ›
            </button>
          </div>

          <div className="ld-tabs">
            {['overview', 'features', 'revenue', 'technology', 'included', 'faqs', 'reviews'].map((t) => (
              <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>
                {t === 'revenue' ? 'Revenue & Analytics' : t === 'included' ? "What's Included" : t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {(tab === 'overview' || tab === 'features') && (
            <section className="ld-block">
              <h2>Overview</h2>
              <p>{listing.description}</p>
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

          {(tab === 'overview' || tab === 'revenue') && (
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

          {(tab === 'overview' || tab === 'technology') && (
            <section className="ld-block">
              <h2>Technology</h2>
              <div className="tech">
                {(listing.techStack || []).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
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
