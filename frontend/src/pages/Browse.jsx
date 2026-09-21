import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ListingCard from '../components/ListingCard.jsx';
import PageLayout from '../components/PageLayout.jsx';

const WEB_CATS = [
  'Tools & Utilities',
  'Blog',
  'E-commerce',
  'News & Media',
  'Education',
  'Finance',
  'Health & Fitness',
  'Travel & Lifestyle',
  'Food & Recipes',
  'Technology',
  'Other',
];

const APP_CATS = [
  'Education',
  'Finance',
  'Health & Fitness',
  'Productivity',
  'Entertainment',
  'Lifestyle',
  'Games',
  'Tools',
  'Business',
  'Social',
  'Travel & Local',
  'Food & Drink',
  'Photography',
  'Weather',
  'Other',
];

const PAGE_SIZE = 8;
const WEB_PIN = [
  'TaskFlow Pro',
  'Travel Guide Blog',
  'Recipe World',
  'GreenKart Store',
  'Aitify Hub',
  'News Portal',
  'StudyNest',
  'FinFlow Blog',
];
const APP_PIN = [
  'Habit Tracker Pro',
  'Study Master',
  'Expense Tracker',
  'Photo Editor Pro',
  'Ludo Star',
  'Weather Live',
  'Recipe Book',
  'Daily Planner',
];

function parseTraffic(value) {
  if (!value) return 0;
  const raw = String(value).toUpperCase().replace(/[^0-9.KMB]/g, '');
  const num = parseFloat(raw) || 0;
  if (raw.includes('M')) return num * 1000000;
  if (raw.includes('K')) return num * 1000;
  return num;
}

function parseDownloads(value) {
  if (!value) return 0;
  const raw = String(value).toUpperCase().replace(/[^0-9.KMB]/g, '');
  const num = parseFloat(raw) || 0;
  if (raw.includes('M')) return num * 1000000;
  if (raw.includes('K')) return num * 1000;
  return num;
}

function daysAgo(dateStr) {
  const t = new Date(dateStr).getTime();
  if (!t) return 9999;
  return (Date.now() - t) / 86400000;
}

function parseYears(value) {
  if (!value || value === '—') return 0;
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(num) ? num : 0;
}

function parseSizeMb(value) {
  if (!value || value === '—') return 0;
  const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(num) ? num : 0;
}

const MONETIZATION_PRESETS = [
  { value: 'Ads', label: 'Ads' },
  { value: 'Affiliate', label: 'Affiliates' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'Product', label: 'Product sales' },
];
const MONETIZATION_VALUES = MONETIZATION_PRESETS.map((item) => item.value);
const CUSTOM_MONETIZATION = '__custom__';

function isCustomMonetization(value) {
  return Boolean(value) && value !== CUSTOM_MONETIZATION && !MONETIZATION_VALUES.includes(value);
}

export default function Browse({ type }) {
  const [params, setParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [page, setPage] = useState(1);
  const [draftQ, setDraftQ] = useState(params.get('q') || '');

  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';
  const minPrice = params.get('min') || '';
  const maxPrice = params.get('max') || '';
  const minRev = params.get('minRev') || '';
  const maxRev = params.get('maxRev') || '';
  const minTraffic = params.get('minTraffic') || '';
  const maxTraffic = params.get('maxTraffic') || '';
  const platform = params.get('platform') || '';
  const monetization = params.get('monetization') || '';
  const downloads = params.get('downloads') || '';
  const revRange = params.get('revRange') || '';
  const updated = params.get('updated') || '';
  const domainAge = params.get('domainAge') || '';
  const appSize = params.get('appSize') || '';
  const monetizationIsCustom = monetization === CUSTOM_MONETIZATION || isCustomMonetization(monetization);
  const [customMonetizationOpen, setCustomMonetizationOpen] = useState(monetizationIsCustom);
  const [draftMonetization, setDraftMonetization] = useState(isCustomMonetization(monetization) ? monetization : '');

  const isApp = type === 'app';
  const cats = isApp ? APP_CATS : WEB_CATS;
  const title = isApp ? 'Android Apps for Sale in India' : 'Websites for Sale in India';
  const crumb = isApp ? 'Android Apps' : 'Websites';

  useEffect(() => {
    setDraftQ(q);
    setPage(1);
  }, [type, q, category, sort]);

  useEffect(() => {
    const isCustom = monetization === CUSTOM_MONETIZATION || isCustomMonetization(monetization);
    setCustomMonetizationOpen(isCustom);
    setDraftMonetization(isCustomMonetization(monetization) ? monetization : '');
  }, [monetization, type]);

  const query = useMemo(() => {
    const p = new URLSearchParams();
    p.set('type', type);
    if (q) p.set('q', q);
    if (category) p.set('category', category);
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
    if (!value || value === 'All' || value === 'all') next.delete(key);
    else next.set(key, value);
    setParams(next);
    setPage(1);
  }

  function setCategory(next) {
    update('category', next);
  }

  function clearFilters() {
    setParams(new URLSearchParams());
    setDraftQ('');
    setPage(1);
  }

  const filtered = useMemo(() => {
    const items = listings.filter((item) => {
      if (minRev && item.monthlyRevenue < Number(minRev)) return false;
      if (maxRev && item.monthlyRevenue > Number(maxRev)) return false;
      if (!isApp) {
        const traffic = parseTraffic(item.traffic);
        if (minTraffic && traffic < Number(minTraffic)) return false;
        if (maxTraffic && traffic > Number(maxTraffic)) return false;
        if (platform && (item.platform || '').toLowerCase() !== platform.toLowerCase()) return false;
        if (monetization && monetization !== CUSTOM_MONETIZATION) {
          const text = String(item.monetization || '').toLowerCase();
          if (!text.includes(monetization.toLowerCase())) return false;
        }
        const age = parseYears(item.domainAge);
        if (domainAge === '1' && age < 1) return false;
        if (domainAge === '2' && age < 2) return false;
        if (domainAge === '3' && age < 3) return false;
        if (domainAge === '5' && age < 5) return false;
      } else {
        const dl = parseDownloads(item.downloads);
        if (downloads === '10k' && dl < 10000) return false;
        if (downloads === '50k' && dl < 50000) return false;
        if (downloads === '100k' && dl < 100000) return false;
        if (downloads === '500k' && dl < 500000) return false;
        if (revRange === '5k' && item.monthlyRevenue < 5000) return false;
        if (revRange === '10k' && item.monthlyRevenue < 10000) return false;
        if (revRange === '20k' && item.monthlyRevenue < 20000) return false;
        if (updated === '30' && daysAgo(item.lastUpdated || item.createdAt) > 30) return false;
        if (updated === '90' && daysAgo(item.lastUpdated || item.createdAt) > 90) return false;
        if (updated === '365' && daysAgo(item.lastUpdated || item.createdAt) > 365) return false;
        if (monetization && monetization !== CUSTOM_MONETIZATION) {
          const text = String(item.monetization || '').toLowerCase();
          if (!text.includes(monetization.toLowerCase())) return false;
        }
        const size = parseSizeMb(item.appSize);
        if (appSize === '10' && size > 10) return false;
        if (appSize === '20' && (size <= 10 || size > 20)) return false;
        if (appSize === '50' && (size <= 20 || size > 50)) return false;
        if (appSize === '50plus' && size <= 50) return false;
      }
      return true;
    });
    if (sort !== 'newest') return items;
    const pin = isApp ? APP_PIN : WEB_PIN;
    return [...items].sort((a, b) => {
      const ai = pin.indexOf(a.name);
      const bi = pin.indexOf(b.name);
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [
    listings,
    isApp,
    sort,
    minRev,
    maxRev,
    minTraffic,
    maxTraffic,
    platform,
      monetization,
      downloads,
      revRange,
      updated,
      domainAge,
      appSize,
    ]);

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
      minPrice ||
      maxPrice ||
      minRev ||
      maxRev ||
      minTraffic ||
      maxTraffic ||
      platform ||
      monetization ||
      downloads ||
      revRange ||
      updated ||
      domainAge ||
      appSize
  );

  return (
    <PageLayout className="browse-page">
      <nav className="browse-crumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <em>{crumb}</em>
      </nav>

      <header className="browse-hero">
        <div>
          <h1>{title}</h1>
          <p>
            {isApp
              ? 'Buy an Android app in India. Browse Play Store apps for sale with downloads, ratings, monthly revenue and asking price in INR.'
              : 'Buy a website in India. Browse websites for sale with real traffic, monthly revenue, domain age and asking price in INR.'}
          </p>
        </div>
        <div className={`browse-promo ${isApp ? 'app' : ''}`}>
          <div className="promo-copy">
            {isApp ? (
              <span className="promo-ico android" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <path d="M17 7l2.2-3.2M7 7L4.8 3.8" stroke="#16a34a" strokeWidth="1.7" strokeLinecap="round" />
                  <rect x="5" y="8" width="14" height="11" rx="3" fill="#22c55e" />
                  <circle cx="9" cy="12.5" r="1.1" fill="#fff" />
                  <circle cx="15" cy="12.5" r="1.1" fill="#fff" />
                </svg>
              </span>
            ) : (
              <span className="promo-ico bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            )}
            <div>
              <strong>{isApp ? 'Find Profitable Android Apps' : 'Find Profitable Websites'}</strong>
              <small>Turn ideas into opportunities.</small>
            </div>
          </div>
          <Link to="/sell" className="btn btn-primary promo-btn">
            {isApp ? 'Sell Your App' : 'Sell Your Website'}
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
                placeholder={isApp ? 'Search Android apps...' : 'Search websites...'}
              />
            </div>
          </form>

          <div className="filter-block">
            <label className="filter-label">Category</label>
            <label className="check-row">
              <input type="checkbox" checked={!category} onChange={() => setCategory('')} />
              <span>All Categories</span>
            </label>
            {cats.map((c) => (
              <label className="check-row" key={c}>
                <input type="checkbox" checked={category === c} onChange={() => setCategory(category === c ? '' : c)} />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="filter-block">
            <label className="filter-label">Price Range</label>
            <div className="filter-pair">
              <input
                type="number"
                placeholder="Min Price"
                defaultValue={minPrice}
                key={`min-${minPrice}-${type}`}
                onBlur={(e) => update('min', e.target.value)}
              />
              <input
                type="number"
                placeholder="Max Price"
                defaultValue={maxPrice}
                key={`max-${maxPrice}-${type}`}
                onBlur={(e) => update('max', e.target.value)}
              />
            </div>
          </div>

          {isApp ? (
            <>
              <div className="filter-block">
                <label className="filter-label">Downloads</label>
                <select value={downloads} onChange={(e) => update('downloads', e.target.value)}>
                  <option value="">Any Range</option>
                  <option value="10k">10K+</option>
                  <option value="50k">50K+</option>
                  <option value="100k">100K+</option>
                  <option value="500k">500K+</option>
                </select>
              </div>
              <div className="filter-block">
                <label className="filter-label">Monthly Revenue</label>
                <select value={revRange} onChange={(e) => update('revRange', e.target.value)}>
                  <option value="">Any Range</option>
                  <option value="5k">₹5,000+</option>
                  <option value="10k">₹10,000+</option>
                  <option value="20k">₹20,000+</option>
                </select>
              </div>
              <div className="filter-block">
                <label className="filter-label">Last Updated</label>
                <select value={updated} onChange={(e) => update('updated', e.target.value)}>
                  <option value="">Any Time</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              <div className="filter-block">
                <label className="filter-label">App Size</label>
                <select value={appSize} onChange={(e) => update('appSize', e.target.value)}>
                  <option value="">Any Size</option>
                  <option value="10">Under 10 MB</option>
                  <option value="20">10–20 MB</option>
                  <option value="50">20–50 MB</option>
                  <option value="50plus">50 MB+</option>
                </select>
              </div>
              <div className="filter-block">
                <label className="filter-label">Monetization</label>
                <select
                  value={customMonetizationOpen ? 'Custom' : monetization}
                  onChange={(e) => {
                    if (e.target.value === 'Custom') {
                      setCustomMonetizationOpen(true);
                      setDraftMonetization('');
                      update('monetization', CUSTOM_MONETIZATION);
                    } else {
                      setCustomMonetizationOpen(false);
                      setDraftMonetization('');
                      update('monetization', e.target.value);
                    }
                  }}
                >
                  <option value="">All Types</option>
                  {MONETIZATION_PRESETS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>
                {customMonetizationOpen && (
                  <input
                    className="filter-custom"
                    value={draftMonetization}
                    onChange={(e) => setDraftMonetization(e.target.value)}
                    onBlur={(e) => update('monetization', e.target.value.trim() || CUSTOM_MONETIZATION)}
                    placeholder="Enter monetization type"
                  />
                )}
              </div>
            </>
          ) : (
            <>
              <div className="filter-block">
                <label className="filter-label">Monthly Revenue</label>
                <div className="filter-pair">
                  <input
                    type="number"
                    placeholder="Min"
                    defaultValue={minRev}
                    key={`minrev-${minRev}`}
                    onBlur={(e) => update('minRev', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={maxRev}
                    key={`maxrev-${maxRev}`}
                    onBlur={(e) => update('maxRev', e.target.value)}
                  />
                </div>
              </div>
              <div className="filter-block">
                <label className="filter-label">Monthly Traffic</label>
                <div className="filter-pair">
                  <input
                    type="number"
                    placeholder="Min"
                    defaultValue={minTraffic}
                    key={`mint-${minTraffic}`}
                    onBlur={(e) => update('minTraffic', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    defaultValue={maxTraffic}
                    key={`maxt-${maxTraffic}`}
                    onBlur={(e) => update('maxTraffic', e.target.value)}
                  />
                </div>
              </div>
              <div className="filter-block">
                <label className="filter-label">Platform</label>
                <select value={platform} onChange={(e) => update('platform', e.target.value)}>
                  <option value="">All Platforms</option>
                  <option value="WordPress">WordPress</option>
                  <option value="Shopify">Shopify</option>
                  <option value="Custom">Custom</option>
                  <option value="Webflow">Webflow</option>
                </select>
              </div>
              <div className="filter-block">
                <label className="filter-label">Monetization</label>
                <select
                  value={customMonetizationOpen ? 'Custom' : monetization}
                  onChange={(e) => {
                    if (e.target.value === 'Custom') {
                      setCustomMonetizationOpen(true);
                      setDraftMonetization('');
                      update('monetization', CUSTOM_MONETIZATION);
                    } else {
                      setCustomMonetizationOpen(false);
                      setDraftMonetization('');
                      update('monetization', e.target.value);
                    }
                  }}
                >
                  <option value="">All Types</option>
                  {MONETIZATION_PRESETS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                  <option value="Custom">Custom</option>
                </select>
                {customMonetizationOpen && (
                  <input
                    className="filter-custom"
                    value={draftMonetization}
                    onChange={(e) => setDraftMonetization(e.target.value)}
                    onBlur={(e) => update('monetization', e.target.value.trim() || CUSTOM_MONETIZATION)}
                    placeholder="Enter monetization type"
                  />
                )}
              </div>
              <div className="filter-block">
                <label className="filter-label">Domain Age</label>
                <select value={domainAge} onChange={(e) => update('domainAge', e.target.value)}>
                  <option value="">Any Age</option>
                  <option value="1">1 year+</option>
                  <option value="2">2 years+</option>
                  <option value="3">3 years+</option>
                  <option value="5">5 years+</option>
                </select>
              </div>
            </>
          )}

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
              {filtered.length} {isApp ? 'Android Apps' : 'Websites'} Found
            </h2>
            <div className="toolbar-right">
              <label>
                Sort by:
                <select value={sort} onChange={(e) => update('sort', e.target.value)}>
                  <option value="newest">Latest Listed</option>
                  <option value="price_asc">Price: low to high</option>
                  <option value="price_desc">Price: high to low</option>
                  <option value="revenue">Highest revenue</option>
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
              <ListingCard key={l.id} listing={l} layout={view} />
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

      {isApp ? (
        <section className="browse-seo" id="android-apps-for-sale-india">
          <h2>Android Apps for Sale in India</h2>
          <p>
            Explore Android apps available for sale on NexMarket. Browse ready-made applications across
            different categories and price ranges, from education and finance tools to health, productivity,
            games and utility apps. Each listing is meant to help a buyer understand what they are looking at
            before they spend time talking to the seller.
          </p>
          <p>
            When you open an app listing you can usually see the category, asking price in INR, download
            range, ratings, monthly revenue where the seller has shared it, and other notes such as last
            update or app size. That mix of details makes it easier to compare two or three apps side by
            side instead of guessing from a title alone. If an app looks like a fit, you can send a message
            or an offer from the listing page and continue the conversation inside your dashboard.
          </p>
          <p>
            Buyers looking for a ready-made Android application often want something they can take over,
            maintain and grow, rather than starting from a blank project. Some listings may already have
            users on the Play Store. Others may be earlier-stage apps with a working product and room to
            improve. Use the filters on this page to narrow by category, price, downloads or revenue, then
            read the listing carefully and ask the seller for Play Console screenshots or extra proof
            before you pay.
          </p>
          <p>
            If you own an Android application and want to sell it, you can also submit your app through
            NexMarket. Create a free account, add the app details, upload screenshots and send the listing
            for admin review. After approval it appears on this Android apps page so interested buyers in
            India can find it. Listing is free for the first few projects; extra listing slots can be added
            later if you need them.
          </p>
          <p>
            NexMarket is a marketplace, not an escrow service and not the owner of the apps you see here.
            Ownership stays with the seller until you both agree a price and complete the transfer. Take
            your time, compare listings, and only move forward when the details on the page and the
            seller&apos;s answers give you a clear picture of the app.
          </p>
        </section>
      ) : (
        <section className="browse-seo" id="websites-for-sale-india">
          <h2>Websites for Sale in India</h2>
          <p>
            Browse websites and online businesses available for sale on NexMarket. This page brings together
            blogs, ecommerce stores, SaaS projects, content websites and other digital businesses with
            different prices and revenue levels, so you can look through real listings instead of starting a
            project from scratch.
          </p>
          <p>
            Find blogs, ecommerce stores, SaaS projects, content websites and other digital businesses with
            different prices and revenue levels. A listing typically includes the asking price in INR,
            category, monthly revenue, traffic, platform and a short description. Some sellers also share
            domain age, monetization method and screenshots. You can use those fields to compare two sites
            in the same niche, or to filter the list down to a budget and category that match what you want.
          </p>
          <p>
            Whether you&apos;re looking for a ready-made website to grow or want to buy an existing online
            business, you can compare available listings, review their details and connect with the seller.
            Open a listing to read the full description, check the live URL where it is provided, and send
            an offer or a message if you want to know more. The seller receives it in their dashboard and
            can reply there. That keeps the first conversation on the platform instead of jumping to a
            random chat app before you have basic facts.
          </p>
          <p>
            Buying a website is still a business decision. Traffic, revenue and history should be checked
            with the seller before any payment. Ask for analytics access, payment proofs or other documents
            that match what is written on the listing. NexMarket reviews listings before they go live, but
            it does not take ownership of the site and it does not complete the transfer for you. You keep
            talking with the seller until you both agree on price and handover steps.
          </p>
          <p>
            If you already run a website and want to sell it, you can list it from the sell page after
            creating an account. Add the name, category, asking price, revenue, traffic and screenshots, then
            wait for admin approval. Once approved, the site appears here for buyers who are browsing
            websites for sale in India. Free accounts can create a small number of listings; extra slots
            are available if you need to list more projects later.
          </p>
        </section>
      )}
    </PageLayout>
  );
}
