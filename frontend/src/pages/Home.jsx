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
            Buy and Sell Websites
            <br />
            and Android Apps in India
          </h1>
          <p className="lede">
            India&apos;s marketplace for websites for sale and Android apps for sale. Browse profitable online businesses or list yours and reach serious buyers in INR.
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
                <strong>Websites for Sale</strong>
                <em>Buy a website in India →</em>
              </span>
            </Link>
            <Link to="/apps" className="cat-chip app">
              <span className="cat-ico green">
                <IconAndroid />
              </span>
              <span>
                <strong>Android Apps for Sale</strong>
                <em>Buy an Android app in India →</em>
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
            <b>1,000+</b>
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
            <h2>Featured Websites and Apps for Sale</h2>
            <p>Handpicked websites for sale and Android apps for sale with traffic, revenue and downloads.</p>
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

      <section className="section how faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <p className="sub">Quick answers before you buy or sell digital projects.</p>
        <div className="faq-list">
          <div>
            <h3>How do I sell a website or Android app?</h3>
            <p>Create a free account, list your project, and wait for admin approval. Buyers can then send offers.</p>
          </div>
          <div>
            <h3>Is listing free?</h3>
            <p>Yes. Free accounts can create 3 listings. After that, ₹100 unlocks 5 extra listings after admin UTR approval.</p>
          </div>
          <div>
            <h3>How do buyers and sellers complete a deal?</h3>
            <p>Talk on NexMarket, agree a price in INR, then transfer ownership using the safety tips on the listing.</p>
          </div>
          <div>
            <h3>I forgot my password. What should I do?</h3>
            <p>Use Forgot Password on the login page. A 6-digit OTP is sent to your email so you can set a new password.</p>
          </div>
          <div>
            <h3>When does a listing go live?</h3>
            <p>Every listing is reviewed by admin first. After approval it appears on Websites or Android Apps for buyers.</p>
          </div>
          <div>
            <h3>Can I buy and sell with one account?</h3>
            <p>Yes. One NexMarket login works for both. You can list projects and also send offers to other sellers.</p>
          </div>
          <div>
            <h3>How do I contact a seller?</h3>
            <p>Open the listing and send an offer or message. The seller gets it in their dashboard and can reply there.</p>
          </div>
          <div>
            <h3>What if a listing looks fake?</h3>
            <p>Report it from the listing page. Admin can remove it, and you should verify traffic or Play Console before paying.</p>
          </div>
          <div>
            <h3>Does NexMarket take ownership of my project?</h3>
            <p>No. NexMarket is only a marketplace. You keep ownership until you complete the transfer with the buyer.</p>
          </div>
        </div>
      </section>

      <section className="cta-wrap">
        <div className="cta">
          <div>
            <h2>Ready to Sell Your Website or Android App in India?</h2>
            <p>List free, reach buyers looking for websites and apps for sale, and deal in INR.</p>
          </div>
          <Link to="/sell" className="btn btn-primary cta-btn">
            List Your Project →
          </Link>
        </div>
      </section>

      <section className="section seo-market" id="marketplace-india">
        <h2>Buy &amp; Sell Websites, Apps &amp; Online Businesses in India</h2>
        <p>
          NexMarket is a digital business marketplace India where buyers and sellers can connect to explore{' '}
          <Link to="/buy-website">buy and sell websites in India</Link>,{' '}
          <Link to="/buy-android-app">buy and sell Android apps in India</Link>, and discover{' '}
          <Link to="/online-businesses">online businesses for sale in India</Link>. Browse{' '}
          <Link to="/websites">websites</Link> and <Link to="/apps">apps for sale</Link>, including profitable
          websites, blogs, ecommerce businesses, SaaS projects, and ready-made Android applications. Whether you
          want to buy profitable website, <Link to="/sell-website">sell website online</Link>, or{' '}
          <Link to="/sell-android-app">sell Android app</Link>, NexMarket provides an easy-to-use website
          marketplace India and online business marketplace India where you can discover digital businesses and
          connect with potential buyers or sellers.
        </p>
      </section>
