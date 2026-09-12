import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import PageLayout from '../components/PageLayout.jsx';

const empty = {
  type: 'website',
  name: '',
  category: 'Tools & Utilities',
  price: '',
  monthlyRevenue: '',
  traffic: '',
  downloads: '',
  description: '',
  techStack: '',
  contact: '',
};

export default function Sell() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await api('/api/listings', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      navigate(`/listing/${data.listing.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  const isApp = form.type === 'app';

  return (
    <PageLayout>
      <div className="sell-hero">
        <p className="eyebrow">Sell Your Project</p>
        <h1>List your website or Android app</h1>
        <p className="lede">Reach thousands of potential buyers. Admin reviews every listing before it goes live.</p>
      </div>
      <form className="form sell-form" onSubmit={submit}>
        <label>Project type</label>
        <div className="type-toggle">
          <button type="button" className={!isApp ? 'on' : ''} onClick={() => set('type', 'website')}>
            Website
          </button>
          <button type="button" className={isApp ? 'on' : ''} onClick={() => set('type', 'app')}>
            Android App
          </button>
        </div>
        <label>Name</label>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
        <label>Category</label>
        <input value={form.category} onChange={(e) => set('category', e.target.value)} required />
        <div className="row">
          <div>
            <label>Asking price (INR)</label>
            <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required />
          </div>
          <div>
            <label>Monthly revenue (INR)</label>
            <input
              type="number"
              value={form.monthlyRevenue}
              onChange={(e) => set('monthlyRevenue', e.target.value)}
            />
          </div>
        </div>
        {isApp ? (
          <>
            <label>Downloads</label>
            <input
              value={form.downloads}
              onChange={(e) => set('downloads', e.target.value)}
              placeholder="10K+"
            />
          </>
        ) : (
          <>
            <label>Monthly visitors</label>
            <input
              value={form.traffic}
              onChange={(e) => set('traffic', e.target.value)}
              placeholder="12K/month"
            />
          </>
        )}
        <label>Description</label>
        <textarea rows="5" value={form.description} onChange={(e) => set('description', e.target.value)} required />
        <label>Tech stack (comma separated)</label>
        <input
          value={form.techStack}
          onChange={(e) => set('techStack', e.target.value)}
          placeholder="React, Node.js, MongoDB"
        />
        <label>Contact email</label>
        <input value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="you@email.com" />
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit">
          List Your Project →
        </button>
      </form>
    </PageLayout>
  );
}
