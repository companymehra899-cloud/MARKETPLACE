import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ListingCard from '../components/ListingCard.jsx';
import PageLayout from '../components/PageLayout.jsx';

const WEB_CATS = ['All', 'Tools & Utilities', 'Tools', 'Marketplace', 'Travel & Lifestyle', 'Ecommerce'];
const APP_CATS = ['All', 'Education', 'Finance', 'Marketplace'];

export default function Browse({ type }) {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const q = params.get('q') || '';
  const category = params.get('category') || 'All';
  const sort = params.get('sort') || 'newest';
  const minPrice = params.get('min') || '';
  const maxPrice = params.get('max') || '';

  const cats = type === 'app' ? APP_CATS : WEB_CATS;
  const title = type === 'app' ? 'Android Apps for Sale' : 'Websites for Sale';

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set('type', type);
    if (q) p.set('q', q);
    if (category && category !== 'All') p.set('category', category);
    if (sort) p.set('sort', sort);
    if (minPrice) p.set('minPrice', minPrice);
    if (maxPrice) p.set('maxPrice', maxPrice);
    return p.toString();
  }, [type, q, category, sort, minPrice, maxPrice]);

  useEffect(() => {
    setError('');
    api(`/api/listings?${query}`)
      .then((d) => setListings(d.listings || []))
      .catch((e) => setError(e.message));
  }, [query]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'All') next.delete(key);
    else next.set(key, value);
    setParams(next);
  }

  return (
    <PageLayout>
      <header className="page-head">
        <div>
          <p className="eyebrow">{type === 'app' ? 'Android Apps' : 'Websites'}</p>
          <h1>{title}</h1>
          <p className="lede">Handpicked digital projects with traffic, revenue, and clear asking prices.</p>
        </div>
        <p className="count">{listings.length} listings</p>
      </header>

      <div className="filters">
        <input
          defaultValue={q}
          key={q + type}
          placeholder="Search projects..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') update('q', e.target.value);
          }}
        />
        <select value={category} onChange={(e) => update('category', e.target.value)}>
          {cats.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => update('sort', e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="revenue">Highest revenue</option>
        </select>
        <input
          type="number"
          placeholder="Min ₹"
          defaultValue={minPrice}
          onBlur={(e) => update('min', e.target.value)}
        />
        <input
          type="number"
          placeholder="Max ₹"
          defaultValue={maxPrice}
          onBlur={(e) => update('max', e.target.value)}
        />
      </div>

      {error && <p className="error">{error}</p>}
      {listings.length === 0 && !error && <p className="empty">No listings match these filters.</p>}
      <div className="cards-4">
        {listings.map((l, i) => (
          <ListingCard key={l.id} listing={l} filled={i % 4 >= 2} />
        ))}
      </div>
    </PageLayout>
  );
}
