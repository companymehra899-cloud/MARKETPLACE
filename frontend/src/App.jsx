import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import Sell from './pages/Sell.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyListings from './pages/MyListings.jsx';
import Admin from './pages/Admin.jsx';
import Static from './pages/Static.jsx';
import {
  OffersPage,
  MessagesPage,
  WatchlistPage,
  EarningsPage,
  ProfilePage,
  SettingsPage,
} from './pages/SellerPages.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Seo from './components/Seo.jsx';

function breadcrumbLd(origin, items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${origin}${item.path}`,
    })),
  };
}

const ROUTE_META = {
  '/': {
    title: 'Buy & Sell Websites and Android Apps in India',
    description:
      "NexMarket is India's marketplace to buy and sell websites and Android apps. Browse verified listings with traffic, revenue and download data, or list your project and reach serious buyers.",
    jsonLd: (origin) => [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NexMarket',
        url: `${origin}/`,
        logo: `${origin}/logo-512.png`,
        email: 'support@nexmarket.in',
        areaServed: 'IN',
        description: "India's marketplace to buy and sell websites and Android apps.",
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'NexMarket',
        url: `${origin}/`,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin}/websites?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  },
  '/websites': {
    title: 'Websites for Sale',
    description:
      'Browse websites for sale on NexMarket. Filter by category, price, monthly revenue and traffic, then connect with verified sellers across India.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Websites for Sale', path: '/websites' },
      ]),
  },
  '/apps': {
    title: 'Android Apps for Sale',
    description:
      'Browse Android apps for sale on NexMarket. Find apps by category, downloads, revenue and price, and buy your next mobile project with confidence.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Android Apps for Sale', path: '/apps' },
      ]),
  },
  '/how-it-works': {
    title: 'How It Works',
    description:
      'Learn how NexMarket works: create a free account, list or discover websites and Android apps, and complete a safe, admin-verified transfer.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'How It Works', path: '/how-it-works' },
      ]),
  },
  '/help': {
    title: 'Help Center',
    description:
      'Get answers about buying and selling on NexMarket, including listing approval, offers, account management and payouts.',
  },
  '/safety': {
    title: 'Safety Tips for Buyers and Sellers',
    description:
      'Follow NexMarket safety tips to verify traffic and revenue, use secure milestone payments and complete a safe website or app transfer.',
  },
  '/terms': {
    title: 'Terms of Service',
    description:
      'Read the NexMarket Terms of Service for using our marketplace to buy and sell websites and Android apps.',
  },
  '/privacy': {
    title: 'Privacy Policy',
    description:
      'Learn how NexMarket collects, uses and protects your account data and listing information.',
  },
  '/contact': {
    title: 'Contact Us',
    description:
      'Contact NexMarket support for help with buying, selling, listings, payments and partnerships.',
  },
};

function RouteSeo() {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname];
  if (!meta) return null;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const jsonLd = typeof meta.jsonLd === 'function' ? meta.jsonLd(origin) : meta.jsonLd;
  return <Seo title={meta.title} description={meta.description} path={pathname} jsonLd={jsonLd} />;
}

function Private({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="page-loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
}

function AdminOnly({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="page-loading">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  return (
    <div className="app-shell">
      <RouteSeo />
      {!hideChrome && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/websites" element={<Browse type="website" />} />
          <Route path="/apps" element={<Browse type="app" />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route
            path="/sell"
            element={
              <Private>
                <Sell />
              </Private>
            }
          />
          <Route
            path="/sell/:id"
            element={
              <Private>
                <Sell />
              </Private>
            }
          />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route
            path="/dashboard"
            element={
              <Private>
                <Dashboard />
              </Private>
            }
          />
          <Route
            path="/dashboard/listings"
            element={
              <Private>
                <MyListings />
              </Private>
            }
          />
          <Route
            path="/dashboard/offers"
            element={
              <Private>
                <OffersPage />
              </Private>
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              <Private>
                <MessagesPage />
              </Private>
            }
          />
          <Route
            path="/dashboard/watchlist"
            element={
              <Private>
                <WatchlistPage />
              </Private>
            }
          />
          <Route
            path="/dashboard/earnings"
            element={
              <Private>
                <EarningsPage />
              </Private>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <Private>
                <ProfilePage />
              </Private>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <Private>
                <SettingsPage />
              </Private>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminOnly>
                <Admin />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/listings"
            element={
              <AdminOnly>
                <Admin />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminOnly>
                <Admin />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminOnly>
                <Admin />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <AdminOnly>
                <Admin />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminOnly>
                <Admin />
              </AdminOnly>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminOnly>
                <Admin />
              </AdminOnly>
            }
          />
          <Route path="/how-it-works" element={<Static kind="how" />} />
          <Route path="/help" element={<Static kind="help" />} />
          <Route path="/safety" element={<Static kind="safety" />} />
          <Route path="/terms" element={<Static kind="terms" />} />
          <Route path="/privacy" element={<Static kind="privacy" />} />
          <Route path="/contact" element={<Static kind="contact" />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}
