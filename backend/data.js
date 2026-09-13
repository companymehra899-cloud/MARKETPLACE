const { v4: uuid } = require('uuid');

const users = [];
const listings = [];
const offers = [];
const messages = [];
const watchlist = [];
const reports = [];
const payments = [];

function seed() {
  if (users.length) return;

  users.push({
    id: uuid(),
    name: 'Admin',
    email: 'admin@nexmarket.in',
    password: 'admin123',
    role: 'admin',
    verified: true,
    blocked: false,
    phone: '9876543210',
    extraListingSlots: 0,
    createdAt: '2022-01-10T00:00:00.000Z',
  });
}

module.exports = { users, listings, offers, messages, watchlist, reports, payments, seed };
