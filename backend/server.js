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

function publicListing(listing) {
  const seller = users.find((u) => u.id === listing.sellerId);
  return {
    ...listing,
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
  const { name, email, password, role } = req.body || {};
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
    role: role === 'admin' ? 'buyer' : 'buyer',
    verified: false,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  const token = uuid();
  tokens.set(token, user.id);
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, verified: user.verified },
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
    user: { id: user.id, name: user.name, email: user.email, role: user.role, verified: user.verified },
  });
});

app.get('/api/auth/me', auth, (req, res) => {
  const { password, ...safe } = req.user;
  res.json({ user: safe });
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
  res.json({ listing: publicListing(listing) });
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
  } = req.body || {};
  if (!type || !name || !price || !description) {
    return res.status(400).json({ error: 'Type, name, price and description required' });
  }
  if (type !== 'website' && type !== 'app') {
    return res.status(400).json({ error: 'Type must be website or app' });
  }
  const listing = {
    id: uuid(),
    type,
    name: String(name).trim(),
    category: category || (type === 'app' ? 'Education' : 'Tools'),
    price: Number(price),
    monthlyRevenue: Number(monthlyRevenue) || 0,
    traffic: type === 'website' ? String(traffic || '0/month') : '',
    downloads: type === 'app' ? String(downloads || '0+') : '',
    description: String(description),
    techStack: Array.isArray(techStack) ? techStack : String(techStack || '').split(',').map((s) => s.trim()).filter(Boolean),
    screenshots: Array.isArray(screenshots) && screenshots.length ? screenshots : [],
    contact: contact || req.user.email,
    sellerId: req.user.id,
    status: 'pending',
    featured: false,
    createdAt: new Date().toISOString(),
  };
  listings.unshift(listing);
  res.status(201).json({ listing: publicListing(listing) });
});

app.get('/api/my/listings', auth, (req, res) => {
  const mine = listings
    .filter((l) => l.sellerId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((l) => ({ ...publicListing(l), uiStatus: uiStatus(l.status) }));
  const stats = {
    total: mine.length,
    active: mine.filter((l) => l.status === 'approved').length,
    review: mine.filter((l) => l.status === 'pending').length,
    sold: mine.filter((l) => l.status === 'sold').length,
    drafts: mine.filter((l) => l.status === 'draft').length,
    earnings: req.user.earnings || mine.filter((l) => l.status === 'sold').reduce((s, l) => s + l.price, 0),
    offers: offers.filter((o) => o.sellerId === req.user.id && o.status === 'open').length,
    messages: messages.filter((m) => m.toId === req.user.id).length,
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
  res.json({ listings: items.map(publicListing) });
});

app.patch('/api/admin/listings/:id', auth, adminOnly, (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  const { status, featured } = req.body || {};
  if (status && ['approved', 'rejected', 'pending'].includes(status)) {
    listing.status = status;
  }
  if (typeof featured === 'boolean') listing.featured = featured;
  res.json({ listing: publicListing(listing) });
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
