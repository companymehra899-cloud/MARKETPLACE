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
