import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { setPreload } from './preload.js';
import { buildMeta, renderHead } from './seoMeta.js';

export function render(url, options = {}) {
  const { origin = '', preload = {} } = options;
  setPreload(preload);

  let html = '';
  try {
    html = renderToString(
      <StaticRouter location={url}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </StaticRouter>
    );
  } catch (err) {
    console.error('SSR render error:', err && err.message);
    html = '';
  }

  const pathname = url.split('?')[0];
  const meta = buildMeta(pathname, preload, origin);
  const head = renderHead(meta, origin);

  return { html, head };
}
