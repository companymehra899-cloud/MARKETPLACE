import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import ListingCard from '../components/ListingCard.jsx';
import {
  IconUsers,
  IconCube,
  IconShield,
  IconChart,
  IconLaptop,
  IconAndroid,
  IconPerson,
  IconChat,
  IconHandshake,
} from '../components/Icons.jsx';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [q, setQ] = useState('');
  const [start, setStart] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api('/api/listings')
      .then((d) => setListings(d.listings || []))
      .catch(() => {});
  }, []);

  const PAGE = 4;
  const featured = listings.filter((l) => l.featured);
  const rest = listings.filter((l) => !l.featured);
  const pool = featured.length ? [...featured, ...rest] : listings;
  const maxStart = Math.max(0, pool.length - PAGE);

  function search(e) {
    e.preventDefault();
    const term = q.trim();
    navigate(`/websites${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Buy &amp; Sell
            <br />
            Websites and Android Apps
          </h1>
          <p className="lede">
            The trusted marketplace for digital projects. Find profitable websites and Android apps or list your own and reach serious buyers.
          </p>
          <form className="hero-search" onSubmit={search}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search websites or Android apps..."
            />
            <button type="submit">Search</button>
          </form>
          <div className="hero-cats">
            <Link to="/websites" className="cat-chip web">
              <span className="cat-ico">
                <IconLaptop />
              </span>
              <span>
                <strong>Browse Websites</strong>
                <em>Explore websites for sale →</em>
              </span>
            </Link>
            <Link to="/apps" className="cat-chip app">
              <span className="cat-ico green">
                <IconAndroid />
              </span>
              <span>
                <strong>Browse Android Apps</strong>
                <em>Explore Android apps for sale →</em>
              </span>
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="laptop">
            <div className="laptop-lid">
              <div className="laptop-screen">
                <div className="site-top">
                  <b>Brand</b>
                  <nav>
                    <span>Home</span>
                    <span>About</span>
                    <span>Services</span>
                    <span>Contact</span>
                  </nav>
                </div>
                <div className="site-hero">
                  <div>
                    <h3>Grow Your Online Business</h3>
                    <button type="button">Get Started</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="laptop-base" />
            <div className="laptop-shadow" />
          </div>
          <div className="phone">
            <div className="phone-frame">
              <div className="notch" />
              <div className="phone-app">
                <div className="droid">
                  <svg viewBox="0 0 64 64" width="40" height="40">
                    <path d="M17 7l2-3M47 7l-2-3" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
                    <path d="M16 28c0-10 7.2-18 16-18s16 8 16 18v16H16V28z" fill="#4ade80" />
                    <circle cx="25" cy="30" r="2.4" fill="#14532d" />
                    <circle cx="39" cy="30" r="2.4" fill="#14532d" />
                  </svg>
                </div>
                <strong>Habit Tracker</strong>
                <small>Build a better you</small>
                <div className="stars">4.8 ★ &nbsp; 10K+ Downloads</div>
                <button type="button">Install</button>
                <div className="mini-apps">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>
          <span className="spark" />
        </div>
      </section>

      <section className="trust">
        <div>
          <IconUsers />
          <div>
            <b>5,000+</b>
            <span>Active Users</span>
          </div>
        </div>
        <div>
          <IconCube />
          <div>
            <b>1,200+</b>
            <span>Projects Listed</span>
          </div>
        </div>
        <div>
          <IconShield />
          <div>
            <b>100%</b>
            <span>Safe &amp; Secure</span>
          </div>
        </div>
        <div>
          <IconChart />
          <div>
            <b>Grow Together</b>
            <span>Buy. Sell. Succeed.</span>
          </div>
        </div>
      </section>

      <section className="section featured-sec">
        <div className="section-head">
          <div>
            <h2>Featured Listings</h2>
            <p>Handpicked websites and Android apps with great potential.</p>
          </div>
          <div className="head-actions">
            <Link to="/websites">View All Listings →</Link>
            <button
              type="button"
              className="circle"
              onClick={() => setStart((s) => Math.max(0, s - 1))}
              disabled={start <= 0}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              type="button"
              className="circle"
              onClick={() => setStart((s) => Math.min(maxStart, s + 1))}
              disabled={start >= maxStart}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>
        <div className="featured-viewport">
          <div
            className="featured-track"
            style={{ transform: `translateX(calc(-${start} * ((100% + 18px) / ${PAGE})))` }}
          >
            {pool.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      <section className="section how" id="how">
        <h2>How It Works</h2>
        <p className="sub">A simple and secure process to buy or sell digital projects.</p>
        <div className="steps">
          <div>
            <div className="step-ico">
              <IconPerson />
            </div>
            <h3>
              <span className="num">1</span> Create Account
            </h3>
            <p>Sign up in minutes and get started.</p>
          </div>
          <div className="arrow">›</div>
          <div>
            <div className="step-ico">
              <IconCube />
            </div>
            <h3>
              <span className="num">2</span> List or Browse
            </h3>
            <p>List your website/app or find the perfect project.</p>
          </div>
          <div className="arrow">›</div>
          <div>
            <div className="step-ico">
              <IconChat />
            </div>
            <h3>
              <span className="num">3</span> Connect &amp; Negotiate
            </h3>
            <p>Talk to buyers or sellers directly and make offers.</p>
          </div>
          <div className="arrow">›</div>
          <div>
            <div className="step-ico">
              <IconHandshake />
            </div>
            <h3>
              <span className="num">4</span> Complete the Deal
            </h3>
            <p>Transfer ownership safely and grow your business.</p>
          </div>
        </div>
      </section>

      <section className="cta-wrap">
        <div className="cta">
          <div>
            <h2>Ready to Sell Your Website or Android App?</h2>
            <p>Reach thousands of potential buyers and get the best value for your project.</p>
          </div>
          <Link to="/sell" className="btn btn-primary cta-btn">
            List Your Project →
          </Link>
        </div>
      </section>
    </div>
  );
}
