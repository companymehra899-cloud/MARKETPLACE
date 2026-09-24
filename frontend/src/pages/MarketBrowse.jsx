import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import MarketCard from '../components/MarketCard.jsx';
import PageLayout from '../components/PageLayout.jsx';
import { MARKET_TYPES } from '../catalog.js';

const PAGE_SIZE = 8;

export default function MarketBrowse({ type }) {
  const cfg = MARKET_TYPES[type];
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [draftQ, setDraftQ] = useState(params.get('q') || '');

  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';

  useEffect(() => {
    setDraftQ(params.get('q') || '');
    setPage(1);
  }, [type, params]);

  useEffect(() => {
    setError('');
    api(`/api/listings?type=${encodeURIComponent(type)}`)
      .then((d) => setListings(d.listings || []))
      .catch((e) => setError(e.message));
  }, [type]);

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'All' || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next);
    setPage(1);
  }

  function clearFilters() {
    setParams(new URLSearchParams());
    setDraftQ('');
    setPage(1);
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const items = listings.filter((listing) => {
      if (term) {
        const haystack = `${listing.name || ''} ${listing.description || ''} ${listing.category || ''} ${
          listing.location || ''
        }`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (category && listing.category !== category) return false;

      for (const f of cfg.filters) {
        if (f.kind === 'select') {
          const value = params.get(f.key);
          if (value && String(listing[f.key] || '').toLowerCase() !== value.toLowerCase()) return false;
        } else if (f.kind === 'text') {
          const value = params.get(f.key);
          if (value && !String(listing[f.key] || '').toLowerCase().includes(value.toLowerCase())) return false;
        } else if (f.kind === 'minmax') {
          const min = Number(params.get(f.minKey));
          const max = Number(params.get(f.maxKey));
          if (min && Number(listing[f.key]) < min) return false;
          if (max && Number(listing[f.key]) > max) return false;
        } else if (f.kind === 'max') {
          const max = Number(params.get(f.maxKey));
          if (max && Number(listing[f.key]) > max) return false;
        } else if (f.kind === 'price') {
          const min = Number(params.get('min'));
          const max = Number(params.get('max'));
          if (min && listing.price < min) return false;
          if (max && listing.price > max) return false;
        }
      }
      return true;
    });

    if (sort === 'price_asc') return items.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') return items.sort((a, b) => b.price - a.price);
    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [listings, cfg, params, q, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
  } else if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }

  const hasFilters = Boolean(
    q ||
      category ||
      cfg.filters.some((f) => {
        if (f.kind === 'price') return params.get('min') || params.get('max');
        if (f.kind === 'minmax') return params.get(f.minKey) || params.get(f.maxKey);
        if (f.kind === 'max') return params.get(f.maxKey);
        return params.get(f.key);
      })
  );

  function renderFilter(f) {
    if (f.kind === 'category') {
      return (
        <div className="filter-block" key="category">
          <label className="filter-label">Category</label>
          <label className="check-row">
            <input type="checkbox" checked={!category} onChange={() => update('category', '')} />
            <span>All Categories</span>
          </label>
          {cfg.categories.map((c) => (
            <label className="check-row" key={c}>
              <input
                type="checkbox"
                checked={category === c}
                onChange={() => update('category', category === c ? '' : c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </div>
      );
    }

    if (f.kind === 'select') {
      return (
        <div className="filter-block" key={f.key}>
          <label className="filter-label">{f.label}</label>
          <select value={params.get(f.key) || ''} onChange={(e) => update(f.key, e.target.value)}>
            <option value="">All</option>
            {f.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (f.kind === 'text') {
      return (
        <div className="filter-block" key={f.key}>
          <label className="filter-label">{f.label}</label>
          <input
            defaultValue={params.get(f.key) || ''}
            key={`${f.key}-${params.get(f.key) || ''}`}
            placeholder={f.placeholder}
            onBlur={(e) => update(f.key, e.target.value)}
          />
        </div>
      );
    }

    if (f.kind === 'minmax') {
      return (
        <div className="filter-block" key={f.key}>
          <label className="filter-label">{f.label}</label>
          <div className="filter-pair">
            <input
              type="number"
              placeholder={f.placeholderMin}
              defaultValue={params.get(f.minKey) || ''}
              key={`${f.minKey}-${params.get(f.minKey) || ''}`}
              onBlur={(e) => update(f.minKey, e.target.value)}
            />
            <input
              type="number"
              placeholder={f.placeholderMax}
              defaultValue={params.get(f.maxKey) || ''}
              key={`${f.maxKey}-${params.get(f.maxKey) || ''}`}
              onBlur={(e) => update(f.maxKey, e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (f.kind === 'max') {
      return (
        <div className="filter-block" key={f.key}>
          <label className="filter-label">{f.label}</label>
          <input
            type="number"
            placeholder={f.placeholder}
            defaultValue={params.get(f.maxKey) || ''}
            key={`${f.maxKey}-${params.get(f.maxKey) || ''}`}
            onBlur={(e) => update(f.maxKey, e.target.value)}
          />
        </div>
      );
    }

    if (f.kind === 'price') {
      return (
        <div className="filter-block" key="price">
          <label className="filter-label">{f.label || 'Price Range'}</label>
          <div className="filter-pair">
            <input
              type="number"
              placeholder="Min Price"
              defaultValue={params.get('min') || ''}
              key={`min-${params.get('min') || ''}`}
              onBlur={(e) => update('min', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              defaultValue={params.get('max') || ''}
              key={`max-${params.get('max') || ''}`}
              onBlur={(e) => update('max', e.target.value)}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <PageLayout className={`browse-page market-browse is-${cfg.accent}`}>
      <nav className="browse-crumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <em>{cfg.label}</em>
      </nav>

      <header className="browse-hero">
        <div>
          <h1>{cfg.title}</h1>
          <p>{cfg.subtitle}</p>
        </div>
        <div className={`browse-promo ${cfg.accent}`}>
          <div className="promo-copy">
            <div>
              <strong>{`Buy & Sell ${cfg.label}`}</strong>
              <small>Post free, reach local buyers.</small>
            </div>
          </div>
          <Link to="/sell" className="btn btn-primary promo-btn">
            {`Sell Your ${cfg.singular}`}
            <span>→</span>
          </Link>
        </div>
      </header>

      <div className="browse-layout">
        <aside className="filter-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update('q', draftQ.trim());
            }}
          >
            <label className="filter-label">Search</label>
            <div className="filter-search">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                value={draftQ}
                onChange={(e) => setDraftQ(e.target.value)}
                placeholder={`Search ${cfg.label.toLowerCase()}...`}
              />
            </div>
          </form>

          {cfg.filters.map(renderFilter)}

          <button type="button" className="clear-filters" onClick={clearFilters} disabled={!hasFilters}>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4v6h6" />
              <path d="M20 20v-6h-6" />
              <path d="M20 9A8 8 0 0 0 6.5 6.5L4 10" />
              <path d="M4 15a8 8 0 0 0 13.5 2.5L20 14" />
            </svg>
            Clear Filters
          </button>
        </aside>

        <section>
          <div className="browse-toolbar">
            <h2>
              {filtered.length} {cfg.label} Found
            </h2>
            <div className="toolbar-right">
              <label>
                Sort by:
                <select value={sort} onChange={(e) => update('sort', e.target.value)}>
                  <option value="newest">Latest Listed</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                </select>
              </label>
              <div className="view-toggle">
                <button
                  type="button"
                  className={view === 'grid' ? 'on' : ''}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={view === 'list' ? 'on' : ''}
                  onClick={() => setView('list')}
                  aria-label="List view"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <rect x="3" y="4" width="18" height="3" rx="1" />
                    <rect x="3" y="10.5" width="18" height="3" rx="1" />
                    <rect x="3" y="17" width="18" height="3" rx="1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {error && <p className="error">{error}</p>}
          {filtered.length === 0 && !error && <p className="empty">No listings match these filters.</p>}

          <div className={view === 'list' ? 'cards-list' : 'cards-4 browse-grid'}>
            {visible.map((l) => (
              <MarketCard key={l.id} listing={l} layout={view} />
            ))}
          </div>

          {filtered.length > 0 && (
            <div className="pager">
              <button type="button" disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                ‹
              </button>
              {pages.map((p, i) =>
                p === '...' ? (
                  <span key={`e${i}`} className="pager-ellipsis">
                    ...
                  </span>
                ) : (
                  <button key={p} type="button" className={p === currentPage ? 'on' : ''} onClick={() => setPage(p)}>
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
