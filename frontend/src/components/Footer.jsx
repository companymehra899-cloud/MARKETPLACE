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
            A modern marketplace for buying and selling websites and Android apps. Helping creators, builders and entrepreneurs grow together.
          </p>
          <div className="socials">
            <a href="#facebook" aria-label="Facebook">f</a>
            <a href="#twitter" aria-label="Twitter">t</a>
            <a href="#linkedin" aria-label="LinkedIn">in</a>
            <a href="#youtube" aria-label="YouTube">▶</a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/websites">Websites</Link>
          <Link to="/apps">Android Apps</Link>
          <Link to="/sell">Sell Your Project</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/contact">Contact Us</Link>
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
          <p className="copy">© 2024 NexMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
