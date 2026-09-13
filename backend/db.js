const { MongoClient } = require('mongodb');
const {
  users,
  listings,
  offers,
  messages,
  watchlist,
  reports,
  payments,
  seed,
} = require('./data');

const COLLECTIONS = {
  users,
  listings,
  offers,
  messages,
  watchlist,
  reports,
  payments,
};

let client;
let db;
let persistTimer;

function replace(arr, items) {
  arr.length = 0;
  arr.push(...items);
}

function stripId(doc) {
  const { _id, ...rest } = doc;
  return rest;
}

async function persist() {
  if (!db) return;
  for (const [name, items] of Object.entries(COLLECTIONS)) {
    const col = db.collection(name);
    await col.deleteMany({});
    if (items.length) await col.insertMany(items.map(stripId));
  }
}

function persistSoon() {
  if (!db) return;
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    persist().catch((err) => console.error('Mongo persist failed:', err.message));
  }, 150);
}

const DEMO_EMAILS = new Set([
  'ravi@seller.in',
  'arjun@buyer.in',
  'anand@seller.in',
  'rahul@seller.in',
]);

function stripDemoAccounts() {
  const demoIds = new Set(users.filter((u) => DEMO_EMAILS.has(u.email)).map((u) => u.id));
  if (!demoIds.size) return false;
  replace(users, users.filter((u) => !demoIds.has(u.id)));
  replace(listings, listings.filter((l) => !demoIds.has(l.sellerId)));
  replace(offers, offers.filter((o) => !demoIds.has(o.buyerId) && !demoIds.has(o.sellerId)));
  replace(messages, messages.filter((m) => !demoIds.has(m.fromId) && !demoIds.has(m.toId)));
  replace(watchlist, watchlist.filter((w) => !demoIds.has(w.userId)));
  replace(reports, reports.filter((r) => !demoIds.has(r.fromId)));
  replace(payments, payments.filter((p) => !demoIds.has(p.userId)));
  return true;
}

async function connectAndLoad() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    seed();
    console.log('No MONGODB_URI set. Using in-memory data.');
    return;
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.MONGODB_DB || 'nexmarket');

  let hasData = false;
  for (const [name, arr] of Object.entries(COLLECTIONS)) {
    const docs = await db.collection(name).find({}).toArray();
    if (docs.length) hasData = true;
    replace(arr, docs.map(stripId));
  }

  if (!hasData) {
    seed();
    await persist();
    console.log('MongoDB empty. Seeded admin account.');
  } else if (stripDemoAccounts()) {
    await persist();
    console.log('MongoDB connected. Removed demo accounts.');
  } else {
    console.log('MongoDB connected. Loaded saved data.');
  }
}

function persistMiddleware(req, res, next) {
  res.on('finish', () => {
    if (
      res.statusCode < 400 &&
      ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method) &&
      req.path.startsWith('/api')
    ) {
      persistSoon();
    }
  });
  next();
}

module.exports = { connectAndLoad, persist, persistMiddleware };
