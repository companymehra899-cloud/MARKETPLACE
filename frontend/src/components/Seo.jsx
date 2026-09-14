import { useEffect } from 'react';

export const SITE_NAME = 'NexMarket';

export const DEFAULT_TITLE = 'NexMarket — Buy. Sell. Grow.';

export const DEFAULT_DESCRIPTION =
  "NexMarket is India's marketplace to buy and sell websites and Android apps. Browse verified listings with traffic, revenue and download data, or list your project and reach serious buyers.";

export const DEFAULT_IMAGE = '/og-image.png';

export function truncate(text, max = 155) {
  const value = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

export function absoluteUrl(value, origin) {
  if (!value) return `${origin}${DEFAULT_IMAGE}`;
  if (/^(https?:)?\/\//i.test(value)) return value;
  if (value.startsWith('data:')) return `${origin}${DEFAULT_IMAGE}`;
  return `${origin}${value.startsWith('/') ? '' : '/'}${value}`;
}

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
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = truncate(description || DEFAULT_DESCRIPTION);
    const canonical = `${origin}${path || window.location.pathname}`;
    const imageUrl = absoluteUrl(image, origin);

    document.title = fullTitle;

    upsertMeta('name', 'description', desc);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
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
