import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { setPreload } from './preload.js';
import './styles.css';

const preload = typeof window !== 'undefined' && window.__PRELOAD__ ? window.__PRELOAD__ : {};
setPreload(preload);

const container = document.getElementById('root');

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (container.dataset.ssr === '1') {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}
