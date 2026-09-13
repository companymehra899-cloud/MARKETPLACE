import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import PageLayout from '../components/PageLayout.jsx';

const COPY = {
  how: {
    title: 'How It Works',
    sub: 'A simple and secure process to buy or sell digital projects.',
    body: [
      'Create a free NexMarket account in minutes.',
      'Sellers list a website or Android app with price, revenue, and traffic or downloads. Admin reviews every listing before it goes live.',
      'Buyers browse, filter, open details, and send an offer in INR.',
      'Seller and buyer connect, negotiate, then complete the ownership transfer off-platform with our safety tips.',
    ],
  },
  help: {
    title: 'Help Center',
    sub: 'Answers for buyers and sellers on NexMarket.',
    body: [
      'Listings go live after admin approval. Pending items stay in your dashboard.',
      'Offers are sent to the seller with your message and amount.',
      'One login for buying and selling. Demo: ravi@seller.in / seller123 or arjun@buyer.in / buyer123. Free accounts can list 3 projects.',
    ],
  },
  safety: {
    title: 'Safety Tips',
    sub: 'Keep every deal clean and verifiable.',
    body: [
      'Verify traffic, revenue, and Play Console screenshots before paying.',
      'Use escrow or milestone payments for large transfers.',
      'Never share account OTPs. Report fake listings from the admin panel.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    sub: 'Using NexMarket means you agree to these terms.',
    body: [
      'NexMarket is a listing marketplace. We do not take ownership of assets.',
      'Sellers must submit accurate revenue and traffic claims.',
      'Admin may reject or unfeature listings that look fraudulent.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sub: 'How we handle account data on this demo.',
    body: [
      'We store name, email, and listing details in memory for this MVP.',
      'Passwords are demo-only. Do not use real credentials.',
      'Offers are visible to the buyer, seller, and admin.',
    ],
  },
  contact: {
    title: 'Contact Us',
    sub: 'Support for buyers, sellers, and partners.',
    body: [
      'Email: support@nexmarket.in',
      'For listing issues, log in and open your dashboard.',
      'Admins can approve, reject, or feature listings from /admin.',
    ],
  },
};

function ContactForm() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setNote('');
    setBusy(true);
    try {
      await api('/api/support', {
        method: 'POST',
        body: JSON.stringify({ name, email, text }),
      });
      setText('');
      setNote('Message sent. Our team will get back to you.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form contact-form" onSubmit={submit}>
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} required />
      <label>Email</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <label>Message</label>
      <textarea rows="5" value={text} onChange={(e) => setText(e.target.value)} required />
      {error && <p className="error">{error}</p>}
      {note && <p className="note">{note}</p>}
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

export default function Static({ kind }) {
  const page = COPY[kind] || COPY.help;
  const isContact = kind === 'contact';
  return (
    <PageLayout>
      <p className="eyebrow">NexMarket</p>
      <h1>{page.title}</h1>
      <p className="lede">{page.sub}</p>
      <ul className="static-list">
        {page.body.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {isContact ? (
        <ContactForm />
      ) : (
        <Link className="btn btn-primary" to="/websites">
          Browse listings
        </Link>
      )}
    </PageLayout>
  );
}
