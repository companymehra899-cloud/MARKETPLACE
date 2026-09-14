const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { v4: uuid } = require('uuid');
const { users, listings, offers, messages, watchlist, reports, payments } = require('./data');
const { connectAndLoad, persistMiddleware } = require('./db');
const { sendOtpEmail, mailProvider } = require('./mail');
const { prepareScreenshots } = require('./images');
const { loadEnv } = require('./env');

loadEnv();

const CONFIG_VARS = [
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'MONGODB_URI',
  'RESEND_API_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'MAIL_FROM',
];

function logConfigStatus() {
  const present = CONFIG_VARS.filter((key) => process.env[key]);
  const missing = CONFIG_VARS.filter((key) => !process.env[key]);
  console.log('Config vars present:', present.length ? present.join(', ') : 'none');
  console.log('Config vars missing:', missing.length ? missing.join(', ') : 'none');
  console.log('Email provider:', mailProvider());
  if (process.env.RENDER && !process.env.RESEND_API_KEY && process.env.SMTP_HOST) {
    console.warn(
      'WARNING: Render Free blocks SMTP ports 25/465/587. Set RESEND_API_KEY to send OTP email.'
    );
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(persistMiddleware);

const tokens = new Map();
const otps = new Map();

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  const userId = tokens.get(token);
  if (!userId) return res.status(401).json({ error: 'Login required' });
  req.user = users.find((u) => u.id === userId);
  if (!req.user) return res.status(401).json({ error: 'Invalid session' });
  if (req.user.blocked) return res.status(403).json({ error: 'This account is blocked' });
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

const FREE_LISTING_LIMIT = 3;
const LISTING_PACK_PRICE = 100;
const LISTING_PACK_SLOTS = 5;
const UPI_ID = 'hhharishsingh@ybl';
const UPI_NAME = 'NexMarket';

function listingCountFor(userId) {
  return listings.filter((l) => l.sellerId === userId && !l.removed).length;
}

function extraSlotsFor(user) {
  return Math.max(0, Number(user && user.extraListingSlots) || 0);
}

function listingLimitFor(user) {
  if (!user || user.role === 'admin') return null;
  return FREE_LISTING_LIMIT + extraSlotsFor(user);
}

function atListingLimit(user) {
  if (!user || user.role === 'admin') return false;
  return listingCountFor(user.id) >= listingLimitFor(user);
}

function pendingPaymentFor(userId) {
  return payments.find((p) => p.userId === userId && p.status === 'pending') || null;
}

function publicUser(user) {
  const { password, ...safe } = user;
  const listingLimit = listingLimitFor(user);
  return {
    ...safe,
    extraListingSlots: extraSlotsFor(user),
    listingCount: listingCountFor(user.id),
    listingLimit,
  };
}

function publicPayment(p) {
  const user = users.find((u) => u.id === p.userId);
  return {
    id: p.id,
    utr: p.utr,
    payerName: p.payerName,
    amount: p.amount,
    slots: p.slots,
    status: p.status,
    createdAt: p.createdAt,
    reviewedAt: p.reviewedAt || null,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          listingCount: listingCountFor(user.id),
          listingLimit: listingLimitFor(user),
          extraListingSlots: extraSlotsFor(user),
        }
      : null,
  };
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
  const { phone, contact, ...rest } = listing;
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
          listingCount: listingCountFor(seller.id),
          activeListings: listings.filter((l) => l.sellerId === seller.id && l.status === 'approved' && !l.removed).length,
        }
      : null,
  };
  if (opts.admin) {
    out.phone = phone || seller?.phone || '';
    out.contact = contact || seller?.email || '';
    if (seller) {
      out.seller = {
        ...out.seller,
        email: seller.email || '',
        phone: seller.phone || '',
      };
    }
  }
  return out;
}

function uiStatus(status) {
  if (status === 'approved') return 'Active';
  if (status === 'pending') return 'Under Review';
  if (status === 'sold') return 'Sold';
  if (status === 'draft') return 'Draft';
  if (status === 'rejected') return 'Rejected';
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
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
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
    blocked: false,
    phone: '',
    extraListingSlots: 0,
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
  if (user.blocked) return res.status(403).json({ error: 'This account is blocked' });
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

app.patch('/api/auth/me', auth, (req, res) => {
  const { name, email, phone } = req.body || {};
  if (name !== undefined) {
    const nextName = String(name).trim();
    if (!nextName) return res.status(400).json({ error: 'Full name required' });
    req.user.name = nextName;
  }
  if (email !== undefined) {
    const nextEmail = String(email).trim().toLowerCase();
    if (!nextEmail) return res.status(400).json({ error: 'Email address required' });
    const taken = users.some((u) => u.id !== req.user.id && u.email.toLowerCase() === nextEmail);
    if (taken) return res.status(400).json({ error: 'Email already registered' });
    req.user.email = nextEmail;
  }
  if (phone !== undefined) {
    req.user.phone = String(phone).trim();
  }
  res.json({ user: publicUser(req.user) });
});

app.patch('/api/auth/password', auth, (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password required' });
  }
  if (req.user.password !== currentPassword) {
    return res.status(400).json({ error: 'Current password is incorrect' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  req.user.password = newPassword;
  res.json({ ok: true });
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = users.find((u) => u.email.toLowerCase() === email);
  if (!user) return res.status(404).json({ error: 'No account found with this email' });
  if (user.blocked) return res.status(403).json({ error: 'This account is blocked' });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  try {
    await sendOtpEmail(email, code);
  } catch (err) {
    console.error('OTP email failed:', err.message);
    return res.status(err.status || 500).json({ error: err.message || 'Could not send OTP email' });
  }
  otps.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });
  res.json({ ok: true, message: 'OTP sent to your email. It is valid for 10 minutes.' });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const otp = String(req.body?.otp || '').trim();
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP required' });
  }
  const record = otps.get(email);
  if (!record || record.expiresAt < Date.now()) {
    otps.delete(email);
    return res.status(400).json({ error: 'OTP expired. Request a new one.' });
  }
  if (record.code !== otp) return res.status(400).json({ error: 'Invalid OTP' });
  res.json({ ok: true });
});

app.post('/api/auth/reset-password', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const otp = String(req.body?.otp || '').trim();
  const newPassword = String(req.body?.newPassword || '');
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP and new password required' });
  }
  const record = otps.get(email);
  if (!record || record.expiresAt < Date.now()) {
    otps.delete(email);
    return res.status(400).json({ error: 'OTP expired. Request a new one.' });
  }
  if (record.code !== otp) return res.status(400).json({ error: 'Invalid OTP' });
  const user = users.find((u) => u.email.toLowerCase() === email);
  if (!user) return res.status(404).json({ error: 'No account found with this email' });
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  user.password = newPassword;
  otps.delete(email);
  res.json({ ok: true });
});

app.get('/api/listings', optionalAuth, (req, res) => {
  const { type, q, minPrice, maxPrice, category, sort, status } = req.query;
  const isAdmin = req.user && req.user.role === 'admin';
  let items = listings.filter((l) => {
    if (l.removed) return false;
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
  if (!listing || listing.removed) return res.status(404).json({ error: 'Listing not found' });
  const isOwner = req.user && req.user.id === listing.sellerId;
  const isAdmin = req.user && req.user.role === 'admin';
  if (listing.status !== 'approved' && !isOwner && !isAdmin) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json({ listing: publicListing(listing, { admin: isAdmin }) });
});

app.post('/api/listings', auth, async (req, res) => {
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
     liveUrl,
     monetization,
     appSize,
     domainAge,
     platform,
   } = req.body || {};
  if (!type || !name || !price || !description) {
    return res.status(400).json({ error: 'Type, name, price and description required' });
  }
  if (type !== 'website' && type !== 'app') {
    return res.status(400).json({ error: 'Type must be website or app' });
  }
  if (atListingLimit(req.user)) {
    return res.status(403).json({
      error: `Listing limit reached. Pay ₹${LISTING_PACK_PRICE} to add ${LISTING_PACK_SLOTS} more listings.`,
      code: 'LISTING_LIMIT',
      listingCount: listingCountFor(req.user.id),
      listingLimit: listingLimitFor(req.user),
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
    screenshots: await prepareScreenshots(screenshots),
    contact: req.user.email,
    phone: String(req.user.phone || '').trim(),
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
    monetization: String(monetization == null ? '' : monetization).trim(),
    language: 'English',
    cover: 'generic',
    platform: type === 'app' ? String(platform || '').trim() || 'Android' : String(platform || '').trim() || 'Web',
    appSize: type === 'app' ? String(appSize || '').trim() || '—' : '',
    minAndroid: type === 'app' ? 'Android 5.0+' : '',
    domainAge: type === 'website' ? String(domainAge || '').trim() || '—' : '',
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

app.patch('/api/listings/:id', auth, async (req, res) => {
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
     liveUrl,
     monetization,
     appSize,
     domainAge,
     platform,
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
  if (listing.type === 'app' && appSize !== undefined) listing.appSize = String(appSize || '').trim() || '—';
  if (listing.type !== 'app') listing.appSize = '';
  if (listing.type === 'website' && domainAge !== undefined) {
    listing.domainAge = String(domainAge || '').trim() || '—';
  }
  if (listing.type !== 'website') listing.domainAge = '';
  if (platform !== undefined) {
    listing.platform =
      listing.type === 'app' ? String(platform || '').trim() || 'Android' : String(platform || '').trim() || 'Web';
  }
  if (description) {
    listing.description = String(description);
    listing.subtitle = String(description).slice(0, 140);
  }
  if (techStack !== undefined) listing.techStack = parseTech(techStack);
  if (screenshots) listing.screenshots = await prepareScreenshots(screenshots);
  if (monetization !== undefined) {
    listing.monetization = String(monetization == null ? '' : monetization).trim();
  }
  listing.contact = req.user.email;
  listing.phone = String(req.user.phone || '').trim();
  if (liveUrl !== undefined) listing.liveUrl = listing.type === 'website' ? String(liveUrl || '').trim() : '';
  listing.lastUpdated = listedOnNow();
  if (listing.status === 'rejected') listing.status = 'pending';
  res.json({ listing: publicListing(listing) });
});

app.get('/api/my/listings', auth, (req, res) => {
  const mine = listings
    .filter((l) => l.sellerId === req.user.id && !l.removed)
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
    listingLimit: listingLimitFor(req.user),
    listingCount: mine.length,
    extraListingSlots: extraSlotsFor(req.user),
    pendingPayment: pendingPaymentFor(req.user.id)
      ? publicPayment(pendingPaymentFor(req.user.id))
      : null,
  };
  res.json({ listings: mine, stats });
});

app.get('/api/payments/pack', auth, (req, res) => {
  const pending = pendingPaymentFor(req.user.id);
  res.json({
    upiId: UPI_ID,
    upiName: UPI_NAME,
    qrImage: '/qr-code.png',
    amount: LISTING_PACK_PRICE,
    slots: LISTING_PACK_SLOTS,
    freeLimit: FREE_LISTING_LIMIT,
    listingCount: listingCountFor(req.user.id),
    listingLimit: listingLimitFor(req.user),
    extraListingSlots: extraSlotsFor(req.user),
    atLimit: atListingLimit(req.user),
    pendingPayment: pending ? publicPayment(pending) : null,
  });
});

app.post('/api/payments/utr', auth, (req, res) => {
  if (req.user.role === 'admin') {
    return res.status(400).json({ error: 'Admin accounts do not need listing packs' });
  }
  const utr = String((req.body && req.body.utr) || '')
    .replace(/\s+/g, '')
    .toUpperCase();
  const payerName = String((req.body && req.body.payerName) || '').trim();
  if (!/^[A-Z0-9]{12}$/.test(utr)) {
    return res.status(400).json({ error: 'Enter a valid 12-character UTR / UPI reference number' });
  }
  if (payerName.length < 2) {
    return res.status(400).json({ error: 'Payment profile name required' });
  }
  if (pendingPaymentFor(req.user.id)) {
    return res.status(400).json({ error: 'A payment is already under admin review' });
  }
  if (payments.some((p) => p.utr === utr)) {
    return res.status(400).json({ error: 'This UTR is already submitted' });
  }
  const payment = {
    id: uuid(),
    userId: req.user.id,
    utr,
    payerName,
    amount: LISTING_PACK_PRICE,
    slots: LISTING_PACK_SLOTS,
    status: 'pending',
    createdAt: new Date().toISOString(),
    reviewedAt: null,
  };
  payments.unshift(payment);
  res.status(201).json({ payment: publicPayment(payment) });
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
    kind: 'listing',
    createdAt: new Date().toISOString(),
  };
  messages.unshift(msg);
  res.status(201).json({ message: msg });
});

function adminUser() {
  return users.find((u) => u.role === 'admin') || null;
}

function supportPayload(m) {
  const from = users.find((u) => u.id === m.fromId);
  return {
    ...m,
    fromName: m.name || from?.name || 'Guest',
    fromEmail: m.email || from?.email || '',
    fromPhone: from?.phone || m.phone || '',
  };
}

app.post('/api/support', optionalAuth, (req, res) => {
  const { name, email, phone, text } = req.body || {};
  const body = String(text || '').trim();
  if (!body) return res.status(400).json({ error: 'Message required' });
  const admin = adminUser();
  if (!admin) return res.status(500).json({ error: 'Support is unavailable' });
  const msg = {
    id: uuid(),
    listingId: '',
    fromId: req.user?.id || '',
    toId: admin.id,
    text: body,
    name: String(name || req.user?.name || 'Guest').trim() || 'Guest',
    email: String(email || req.user?.email || '').trim(),
    phone: String(phone || req.user?.phone || '').trim(),
    kind: 'support',
    createdAt: new Date().toISOString(),
  };
  messages.unshift(msg);
  res.status(201).json({ message: supportPayload(msg) });
});

app.get('/api/admin/messages', auth, adminOnly, (_req, res) => {
  res.json({
    messages: messages
      .filter((m) => m.kind === 'support' || m.toId === _req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(supportPayload),
  });
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
  if (atListingLimit(req.user)) {
    return res.status(403).json({
      error: `Listing limit reached. Pay ₹${LISTING_PACK_PRICE} to add ${LISTING_PACK_SLOTS} more listings.`,
      code: 'LISTING_LIMIT',
      listingCount: listingCountFor(req.user.id),
      listingLimit: listingLimitFor(req.user),
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
  const accounts = users.filter((u) => u.role !== 'admin');
  const visibleListings = listings.filter((l) => !l.removed);
  res.json({
    users: accounts.length,
    listings: visibleListings.length,
    pending: visibleListings.filter((l) => l.status === 'pending').length,
    approved: visibleListings.filter((l) => l.status === 'approved').length,
    rejected: visibleListings.filter((l) => l.status === 'rejected').length,
    sold: visibleListings.filter((l) => l.status === 'sold').length,
    reports: reports.length,
    pendingPayments: payments.filter((p) => p.status === 'pending').length,
  });
});

app.get('/api/admin/payments', auth, adminOnly, (req, res) => {
  const { status } = req.query;
  let items = payments.slice();
  if (status && ['pending', 'approved', 'rejected'].includes(String(status))) {
    items = items.filter((p) => p.status === status);
  }
  res.json({
    payments: items
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(publicPayment),
  });
});

app.patch('/api/admin/payments/:id', auth, adminOnly, (req, res) => {
  const payment = payments.find((p) => p.id === req.params.id);
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  const status = String((req.body && req.body.status) || '');
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be approved or rejected' });
  }
  if (payment.status !== 'pending') {
    return res.status(400).json({ error: 'This payment was already reviewed' });
  }
  payment.status = status;
  payment.reviewedAt = new Date().toISOString();
  if (status === 'approved') {
    const user = users.find((u) => u.id === payment.userId);
    if (user) {
      user.extraListingSlots = extraSlotsFor(user) + (payment.slots || LISTING_PACK_SLOTS);
    }
  }
  res.json({ payment: publicPayment(payment) });
});

app.get('/api/admin/listings', auth, adminOnly, (req, res) => {
  const { status } = req.query;
  let items = listings.filter((l) => !l.removed);
  if (status) items = items.filter((l) => l.status === status);
  res.json({
    listings: items
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((l) => ({
        ...publicListing(l, { admin: true }),
        uiStatus: uiStatus(l.status),
      })),
  });
});

app.patch('/api/admin/listings/:id', auth, adminOnly, (req, res) => {
  const listing = listings.find((l) => l.id === req.params.id);
  if (!listing || listing.removed) return res.status(404).json({ error: 'Listing not found' });
  const { status, featured, removed } = req.body || {};
  if (status && ['approved', 'rejected', 'pending', 'sold'].includes(status)) {
    listing.status = status;
  }
  if (typeof featured === 'boolean') listing.featured = featured;
  if (removed === true) listing.removed = true;
  listing.lastUpdated = listedOnNow();
  res.json({ listing: publicListing(listing, { admin: true }), uiStatus: uiStatus(listing.status) });
});

app.get('/api/admin/users', auth, adminOnly, (_req, res) => {
  res.json({
    users: users
      .filter((u) => u.role !== 'admin')
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        blocked: Boolean(u.blocked),
        createdAt: u.createdAt,
        listingCount: listingCountFor(u.id),
        listings: listings
          .filter((l) => l.sellerId === u.id && !l.removed)
          .map((l) => ({
            id: l.id,
            name: l.name,
            type: l.type,
            price: l.price,
            status: l.status,
            uiStatus: uiStatus(l.status),
          })),
      })),
  });
});

app.get('/api/admin/reports', auth, adminOnly, (_req, res) => {
  res.json({
    reports: reports
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((r) => {
        const listing = listings.find((l) => l.id === r.listingId);
        const from = users.find((u) => u.id === r.fromId);
        return {
          ...r,
          listingName: listing ? listing.name : 'Listing',
          listingRemoved: Boolean(listing && listing.removed),
          fromName: from ? from.name : 'User',
          fromEmail: from ? from.email : '',
        };
      }),
  });
});

app.patch('/api/admin/users/:id', auth, adminOnly, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'admin') return res.status(400).json({ error: 'Cannot change admin account' });
  if (typeof req.body.blocked === 'boolean') user.blocked = req.body.blocked;
  res.json({ user: publicUser(user) });
});

const SITEMAP_STATIC_PAGES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/websites', changefreq: 'daily', priority: '0.9' },
  { path: '/apps', changefreq: 'daily', priority: '0.9' },
  { path: '/how-it-works', changefreq: 'monthly', priority: '0.5' },
  { path: '/help', changefreq: 'monthly', priority: '0.5' },
  { path: '/safety', changefreq: 'monthly', priority: '0.5' },
  { path: '/contact', changefreq: 'monthly', priority: '0.4' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
];

function siteBaseUrl(req) {
  const configured = process.env.SITE_URL || process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL;
  if (configured) return configured.replace(/\/+$/, '');
  const proto = String(req.get('x-forwarded-proto') || req.protocol || 'https').split(',')[0].trim();
  return `${proto}://${req.get('host')}`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sitemapDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

app.get('/sitemap.xml', (req, res) => {
  const base = siteBaseUrl(req);
  const urls = SITEMAP_STATIC_PAGES.map((page) => ({
    loc: `${base}${page.path}`,
    lastmod: sitemapDate(),
    changefreq: page.changefreq,
    priority: page.priority,
  }));

  for (const listing of listings) {
    if (listing.removed || listing.hiddenPublic || listing.status !== 'approved') continue;
    urls.push({
      loc: `${base}/listing/${listing.id}`,
      lastmod: sitemapDate(listing.createdAt),
      changefreq: 'weekly',
      priority: '0.8',
    });
  }

  const body = urls
    .map(
      (url) =>
        `  <url>\n` +
        `    <loc>${escapeXml(url.loc)}</loc>\n` +
        `    <lastmod>${url.lastmod}</lastmod>\n` +
        `    <changefreq>${url.changefreq}</changefreq>\n` +
        `    <priority>${url.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n');

  res
    .type('application/xml')
    .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
});

app.get('/robots.txt', (req, res) => {
  const base = siteBaseUrl(req);
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /dashboard',
    'Disallow: /login',
    'Disallow: /register',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ];
  res.type('text/plain').send(lines.join('\n'));
});

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  const indexFile = path.join(distPath, 'index.html');
  const indexHtml = fs.readFileSync(indexFile, 'utf8');

  app.use(express.static(distPath, { index: false }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res
      .type('html')
      .set('Cache-Control', 'no-cache')
      .send(indexHtml.split('__SITE_URL__').join(siteBaseUrl(req)));
  });
}

connectAndLoad()
  .then(() => {
    logConfigStatus();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`NexMarket API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
