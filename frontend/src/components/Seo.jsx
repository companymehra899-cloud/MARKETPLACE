import { useEffect } from 'react';
import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  truncate,
  absoluteUrl,
  fullTitle,
} from '../seoMeta.js';

export { SITE_NAME, DEFAULT_TITLE, DEFAULT_DESCRIPTION, DEFAULT_IMAGE, truncate, absoluteUrl } from '../seoMeta.js';

function upsertMeta(attr, key, content) {
  if (content == null || content === '') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', String(content));
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, image, type = 'website', path, jsonLd }) {
  useEffect(() => {
    const origin = window.location.origin;
    const pageTitle = fullTitle(title);
    const desc = truncate(description || DEFAULT_DESCRIPTION);
    const canonical = `${origin}${path || window.location.pathname}`;
    const imageUrl = absoluteUrl(image, origin);

    document.title = pageTitle;

    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', pageTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', pageTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', imageUrl);

    upsertLink('canonical', canonical);

    document.querySelectorAll('script[data-seo-jsonld]').forEach((el) => el.remove());
    const list = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    list.filter(Boolean).forEach((obj) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', '');
      script.text = JSON.stringify(obj);
      document.head.appendChild(script);
    });
  }, [title, description, image, type, path, jsonLd]);

  return null;
}
