import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="foot-brand">
          <Logo />
          <p>
            Buy and sell websites and Android apps in India. NexMarket lists online businesses with traffic, revenue and downloads, priced in INR.
          </p>
          <div className="socials">
            <a href="#facebook" aria-label="Facebook">f</a>
            <a href="#twitter" aria-label="Twitter">t</a>
            <a href="#linkedin" aria-label="LinkedIn">in</a>
            <a href="#youtube" aria-label="YouTube">▶</a>
          </div>
        </div>
        <div>
          <h4>Marketplace</h4>
          <Link to="/websites">Websites for Sale</Link>
          <Link to="/apps">Android Apps for Sale</Link>
          <Link to="/buy-website">Buy a Website</Link>
          <Link to="/sell-website">Sell Your Website</Link>
          <Link to="/buy-android-app">Buy an Android App</Link>
          <Link to="/sell-android-app">Sell Your Android App</Link>
          <Link to="/online-businesses">Online Businesses</Link>
        </div>
        <div>
          <h4>Support</h4>
          <Link to="/help">Help Center</Link>
          <Link to="/safety">Safety Tips</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/contact">Contact Support</Link>
        </div>
        <div>
          <h4>Newsletter</h4>
          <p>Get the latest listings and updates.</p>
          <form
            className="news"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {done && <small>Subscribed.</small>}
          <p className="copy">© {new Date().getFullYear()} NexMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
