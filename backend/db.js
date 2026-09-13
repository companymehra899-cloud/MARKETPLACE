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
    console.log('MongoDB empty. Seeded demo data.');
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
