const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const { users, listings, offers, messages, watchlist, seed } = require('./data');

seed();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

const tokens = new Map();

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  const userId = tokens.get(token);
  if (!userId) return res.status(401).json({ error: 'Login required' });
  req.user = users.find((u) => u.id === userId);
  if (!req.user) return res.status(401).json({ error: 'Invalid session' });
  next();
}

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  const userId = tokens.get(token);
  req.user = users.find((u) => u.id === userId) || null;
  next();
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}

const MAX_SHOTS = 2;
const MAX_SHOT_CHARS = 220000;
const FREE_LISTING_LIMIT = 3;

function listingCountFor(userId) {
  return listings.filter((l) => l.sellerId === userId).length;
}

function atFreeListingLimit(user) {
  if (!user || user.role === 'admin') return false;
  return listingCountFor(user.id) >= FREE_LISTING_LIMIT;
}

function publicUser(user) {
  const { password, ...safe } = user;
  return {
    ...safe,
    listingCount: listingCountFor(user.id),
    listingLimit: user.role === 'admin' ? null : FREE_LISTING_LIMIT,
  };
}

function sanitizeScreenshots(list) {
  if (!Array.isArray(list)) return [];
  return list
    .filter((s) => typeof s === 'string')
    .filter((s) => s.startsWith('data:image/') || /^https?:\/\//.test(s))
    .filter((s) => s.length <= MAX_SHOT_CHARS)
    .slice(0, MAX_SHOTS);
}

function listedOnNow() {
  return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function parseTech(techStack) {
  if (Array.isArray(techStack)) return techStack.map((s) => String(s).trim()).filter(Boolean);
  return String(techStack || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function publicListing(listing, opts = {}) {
  const seller = users.find((u) => u.id === listing.sellerId);
  const { phone, ...rest } = listing;
  const out = {
    ...rest,
    seller: seller
      ? {
          id: seller.id,
          name: seller.name,
          verified: seller.verified,
          createdAt: seller.createdAt,
          rating: seller.rating || 4.8,
          reviews: seller.reviews || 0,
        }
      : null,
  };
  if (opts.includePrivate) out.phone = phone || '';
  return out;
}

function uiStatus(status) {
  if (status === 'approved') return 'Active';
  if (status === 'pending') return 'Under Review';
  if (status === 'sold') return 'Sold';
  if (status === 'draft') return 'Draft';
  return status;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, name: 'NexMarket' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }
  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const user = {
    id: uuid(),
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    password: String(password),
    role: 'user',
    verified: false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  const token = uuid();
  tokens.set(token, user.id);
  res.json({
    token,
    user: publicUser(user),
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(
    (u) => u.email.toLowerCase() === String(email || '').toLowerCase() && u.password === password
  );
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  const token = uuid();
  tokens.set(token, user.id);
  res.json({
    token,
    user: publicUser(user),
  });
});

app.get('/api/auth/me', auth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.get('/api/listings', optionalAuth, (req, res) => {
  const { type, q, minPrice, maxPrice, category, sort, status } = req.query;
  const isAdmin = req.user && req.user.role === 'admin';
  let items = listings.filter((l) => {
    if (l.hiddenPublic && !(req.user && req.user.id === l.sellerId)) return false;
    if (isAdmin && status) return l.status === status;
    if (!isAdmin) return l.status === 'approved';
    return true;
  });
  if (type === 'website' || type === 'app') {
    items = items.filter((l) => l.type === type);
  }
  if (category) {
    items = items.filter((l) => l.category.toLowerCase() === String(category).toLowerCase());
  }
  if (q) {
    const term = String(q).toLowerCase();
    items = items.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.description.toLowerCase().includes(term) ||
        l.category.toLowerCase().includes(term)
    );
  }
  if (minPrice) items = items.filter((l) => l.price >= Number(minPrice));
  if (maxPrice) items = items.filter((l) => l.price <= Number(maxPrice));
  if (sort === 'price_asc') items.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') items.sort((a, b) => b.price - a.price);
  else if (sort === 'revenue') items.sort((a, b) => b.monthlyRevenue - a.monthlyRevenue);
  else items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ listings: items.map(publicListing) });
});

app.get('/api/listings/:id', optionalAuth, (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  const isOwner = req.user && req.user.id === listing.sellerId;
  const isAdmin = req.user && req.user.role === 'admin';
  if (listing.status !== 'approved' && !isOwner && !isAdmin) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json({ listing: publicListing(listing, { includePrivate: isOwner || isAdmin }) });
});

app.post('/api/listings', auth, (req, res) => {
  const {
    type,
    name,
    category,
    price,
    monthlyRevenue,
    traffic,
    downloads,
    description,
    techStack,
    screenshots,
    contact,
    phone,
    liveUrl,
  } = req.body || {};
  if (!type || !name || !price || !description) {
    return res.status(400).json({ error: 'Type, name, price and description required' });
  }
  if (type !== 'website' && type !== 'app') {
    return res.status(400).json({ error: 'Type must be website or app' });
  }
  if (atFreeListingLimit(req.user)) {
    return res.status(403).json({
      error: `Free plan allows ${FREE_LISTING_LIMIT} listings per account.`,
    });
  }
  const listedOn = listedOnNow();
  const desc = String(description);
  const listing = {
    id: uuid(),
    type,
    name: String(name).trim(),
    subtitle: desc.slice(0, 140),
    category: category || (type === 'app' ? 'Education' : 'Tools & Utilities'),
    price: Number(price),
    monthlyRevenue: Number(monthlyRevenue) || 0,
    traffic: type === 'website' ? String(traffic || '0/month') : '',
    downloads: type === 'app' ? String(downloads || '0+') : '',
    description: desc,
    techStack: parseTech(techStack),
    screenshots: sanitizeScreenshots(screenshots),
    contact: contact || req.user.email,
    phone: String(phone || '').trim(),
    liveUrl: type === 'website' ? String(liveUrl || '').trim() : '',
    sellerId: req.user.id,
    status: 'pending',
    featured: false,
    createdAt: new Date().toISOString(),
    keyFeatures: ['Source and assets included', 'Admin-reviewed listing', 'Direct seller contact'],
    whySelling: 'Looking for a buyer to take this project forward.',
    included: type === 'app' ? 'Source code, store assets, documentation' : 'Domain, hosting notes, content, analytics',
    support: '2 Weeks Support',
    lastUpdated: listedOn,
    listedOn,
    rating: 0,
    reviews: 0,
    monetization: 'To be confirmed with seller',
    language: 'English',
    cover: 'generic',
    appSize: type === 'app' ? '—' : '',
    minAndroid: type === 'app' ? 'Android 5.0+' : '',
    domainAge: type === 'website' ? '—' : '',
    userStats: {
      downloads: type === 'app' ? String(downloads || '0+') : String(traffic || '0'),
      users: '—',
      rating: '—',
      retention: '—',
    },
  };
  listings.unshift(listing);
  res.status(201).json({ listing: publicListing(listing) });
});

app.patch('/api/listings/:id', auth, (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (listing.sellerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not allowed' });
  }
  const {
    type,
    name,
    category,
    price,
    monthlyRevenue,
    traffic,
    downloads,
    description,
    techStack,
    screenshots,
    contact,
    phone,
    liveUrl,
  } = req.body || {};
  if (type && type !== 'website' && type !== 'app') {
    return res.status(400).json({ error: 'Type must be website or app' });
  }
  if (type) listing.type = type;
  if (name) listing.name = String(name).trim();
  if (category) listing.category = category;
  if (price !== undefined && price !== '') listing.price = Number(price);
  if (monthlyRevenue !== undefined && monthlyRevenue !== '') listing.monthlyRevenue = Number(monthlyRevenue) || 0;
  if (listing.type === 'website' && traffic !== undefined) listing.traffic = String(traffic || '0/month');
  if (listing.type === 'app' && downloads !== undefined) listing.downloads = String(downloads || '0+');
  if (description) {
    listing.description = String(description);
    listing.subtitle = String(description).slice(0, 140);
  }
  if (techStack !== undefined) listing.techStack = parseTech(techStack);
  if (screenshots) listing.screenshots = sanitizeScreenshots(screenshots);
  if (contact !== undefined) listing.contact = contact || req.user.email;
  if (phone !== undefined) listing.phone = String(phone || '').trim();
  if (liveUrl !== undefined) listing.liveUrl = listing.type === 'website' ? String(liveUrl || '').trim() : '';
  listing.lastUpdated = listedOnNow();
  if (listing.status === 'rejected') listing.status = 'pending';
  res.json({ listing: publicListing(listing, { includePrivate: true }) });
});

app.get('/api/my/listings', auth, (req, res) => {
  const mine = listings
    .filter((l) => l.sellerId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((l) => ({ ...publicListing(l, { includePrivate: true }), uiStatus: uiStatus(l.status) }));
  const stats = {
    total: mine.length,
    active: mine.filter((l) => l.status === 'approved').length,
    review: mine.filter((l) => l.status === 'pending').length,
    sold: mine.filter((l) => l.status === 'sold').length,
    drafts: mine.filter((l) => l.status === 'draft').length,
    earnings: req.user.earnings || mine.filter((l) => l.status === 'sold').reduce((s, l) => s + l.price, 0),
    offers: offers.filter((o) => o.sellerId === req.user.id && o.status === 'open').length,
    messages: messages.filter((m) => m.toId === req.user.id).length,
    listingLimit: req.user.role === 'admin' ? null : FREE_LISTING_LIMIT,
    listingCount: mine.length,
  };
  res.json({ listings: mine, stats });
});

app.get('/api/messages', auth, (req, res) => {
  const mine = messages
    .filter((m) => m.toId === req.user.id || m.fromId === req.user.id)
    .map((m) => {
      const listing = listings.find((l) => l.id === m.listingId);
      const from = users.find((u) => u.id === m.fromId);
      return {
        ...m,
        listingName: listing ? listing.name : 'Listing',
        fromName: from ? from.name : 'User',
      };
    });
  res.json({ messages: mine });
});

app.post('/api/messages', auth, (req, res) => {
  const { listingId, text, toId } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Message required' });
  const listing = listings.find((l) => l.id === listingId);
  const target = toId || (listing ? listing.sellerId : null);
  if (!target) return res.status(400).json({ error: 'Recipient required' });
  const msg = {
    id: uuid(),
    listingId: listingId || '',
    fromId: req.user.id,
    toId: target,
    text: String(text),
    createdAt: new Date().toISOString(),
  };
  messages.unshift(msg);
  res.status(201).json({ message: msg });
});

app.get('/api/watchlist', auth, (req, res) => {
  const ids = watchlist.filter((w) => w.userId === req.user.id).map((w) => w.listingId);
  res.json({ listings: listings.filter((l) => ids.includes(l.id)).map(publicListing) });
});

app.post('/api/watchlist/:id', auth, (req, res) => {
  const exists = watchlist.find((w) => w.userId === req.user.id && w.listingId === req.params.id);
  if (!exists) watchlist.push({ userId: req.user.id, listingId: req.params.id });
  res.json({ ok: true });
});

app.post('/api/listings/:id/duplicate', auth, (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id && l.sellerId === req.user.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (atFreeListingLimit(req.user)) {
    return res.status(403).json({
      error: `Free plan allows ${FREE_LISTING_LIMIT} listings per account.`,
    });
  }
  const copy = {
    ...listing,
    id: uuid(),
    name: `${listing.name} Copy`,
    status: 'draft',
    featured: false,
    hiddenPublic: false,
    createdAt: new Date().toISOString(),
    listedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };
  listings.unshift(copy);
  res.status(201).json({ listing: publicListing(copy) });
});

app.post('/api/listings/:id/offers', auth, (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing || listing.status !== 'approved') {
    return res.status(404).json({ error: 'Listing not found' });
  }
  if (listing.sellerId === req.user.id) {
    return res.status(400).json({ error: 'Cannot offer on your own listing' });
  }
  const { amount, message } = req.body || {};
  if (!amount) return res.status(400).json({ error: 'Offer amount required' });
  const offer = {
    id: uuid(),
    listingId: listing.id,
    buyerId: req.user.id,
    sellerId: listing.sellerId,
    amount: Number(amount),
    message: String(message || ''),
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  offers.unshift(offer);
  res.status(201).json({ offer });
});

app.get('/api/my/offers', auth, (req, res) => {
  const mine = offers.filter((o) => o.buyerId === req.user.id || o.sellerId === req.user.id);
  const enriched = mine.map((o) => {
    const listing = listings.find((l) => l.id === o.listingId);
    const buyer = users.find((u) => u.id === o.buyerId);
    return {
      ...o,
      listingName: listing ? listing.name : 'Unknown',
      listingType: listing ? listing.type : '',
      buyerName: buyer ? buyer.name : 'Buyer',
    };
  });
  res.json({ offers: enriched });
});

app.get('/api/admin/stats', auth, adminOnly, (_req, res) => {
  res.json({
    users: users.length,
    listings: listings.length,
    pending: listings.filter((l) => l.status === 'pending').length,
    approved: listings.filter((l) => l.status === 'approved').length,
    rejected: listings.filter((l) => l.status === 'rejected').length,
    offers: offers.length,
  });
});

app.get('/api/admin/listings', auth, adminOnly, (req, res) => {
  const { status } = req.query;
  let items = listings;
  if (status) items = items.filter((l) => l.status === status);
  res.json({ listings: items.map((l) => publicListing(l, { includePrivate: true })) });
});

app.patch('/api/admin/listings/:id', auth, adminOnly, (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  const { status, featured } = req.body || {};
  if (status && ['approved', 'rejected', 'pending'].includes(status)) {
    listing.status = status;
  }
  if (typeof featured === 'boolean') listing.featured = featured;
  res.json({ listing: publicListing(listing, { includePrivate: true }) });
});

app.get('/api/admin/users', auth, adminOnly, (_req, res) => {
  res.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      verified: u.verified,
      createdAt: u.createdAt,
    })),
  });
});

app.patch('/api/admin/users/:id', auth, adminOnly, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (typeof req.body.verified === 'boolean') user.verified = req.body.verified;
  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, verified: user.verified },
  });
});

app.listen(PORT, () => {
  console.log(`NexMarket API running on http://localhost:${PORT}`);
});
