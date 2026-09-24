import { inr } from './format.js';
import { MARKET_TYPES } from './catalog.js';

export const SITE_NAME = 'NexMarket';

export const DEFAULT_TITLE = 'Buy and Sell Websites and Android Apps in India | NexMarket';

export const DEFAULT_DESCRIPTION =
  'Buy and sell websites and Android apps in India on NexMarket. Browse websites for sale, Android apps for sale and online businesses with traffic, revenue and downloads in INR.';

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

export function fullTitle(title) {
  return title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
}

export function breadcrumbLd(origin, items) {
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

export const ROUTE_META = {
  '/': {
    title: 'Buy and Sell Websites and Android Apps in India',
    description:
      'Buy and sell websites and Android apps in India. NexMarket lists profitable websites for sale and Android apps for sale with traffic, revenue, downloads and INR prices.',
    jsonLd: (origin) => [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'NexMarket',
        url: `${origin}/`,
        logo: `${origin}/logo-512.png`,
        email: 'support@nexmarket.in',
        areaServed: 'IN',
        description: 'Marketplace in India to buy and sell websites, Android apps and online businesses.',
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
    title: 'Websites for Sale in India',
    description:
      'Websites for sale in India. Buy a profitable website with traffic, monthly revenue and asking price in INR. Filter blogs, ecommerce, SaaS and more on NexMarket.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Websites for Sale', path: '/websites' },
      ]),
  },
  '/apps': {
    title: 'Android Apps for Sale in India',
    description:
      'Android apps for sale in India. Buy a Play Store app with downloads, ratings and monthly revenue in INR. Browse education, finance, games and more on NexMarket.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Android Apps for Sale', path: '/apps' },
      ]),
  },
  '/vehicles': {
    title: 'Vehicles for Sale in India',
    description:
      'Used cars, bikes and scooters for sale in India. Compare brand, year, kilometres driven, fuel type and price in INR on NexMarket.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Vehicles for Sale', path: '/vehicles' },
      ]),
  },
  '/mobiles': {
    title: 'Second Hand Mobiles for Sale in India',
    description:
      'Second hand mobiles for sale in India. Buy used smartphones with brand, storage, condition, warranty and price in INR on NexMarket.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Mobiles for Sale', path: '/mobiles' },
      ]),
  },
  '/services': {
    title: 'Local Services in India',
    description:
      'Find local services in India. Browse home services, repairs, education, IT and more with location and starting price in INR on NexMarket.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
      ]),
  },
  '/tours': {
    title: 'Tour and Travel Packages in India',
    description:
      'Tour and travel packages in India. Explore domestic and international trips, adventure and pilgrimage tours with duration and price in INR on NexMarket.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Tour & Travels', path: '/tours' },
      ]),
  },
  '/how-it-works': {
    title: 'How to Buy and Sell a Website or App',
    description:
      'How NexMarket works: create a free account, list or buy a website or Android app in India, send an offer in INR, and complete a safe ownership transfer.',
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
  '/buy-website': {
    title: 'Buy a Website in India',
    description:
      'Buy a website in India on NexMarket. Browse websites for sale with traffic, monthly revenue and INR asking prices, then send an offer to the seller.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Buy a Website', path: '/buy-website' },
      ]),
  },
  '/sell-website': {
    title: 'Sell Your Website in India',
    description:
      'Sell your website in India. List for free on NexMarket, reach buyers looking for traffic and revenue, and negotiate the sale in INR.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Sell Your Website', path: '/sell-website' },
      ]),
  },
  '/buy-android-app': {
    title: 'Buy an Android App in India',
    description:
      'Buy an Android app in India. Find Play Store apps for sale with downloads, ratings and monthly revenue, then make an offer in INR.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Buy an Android App', path: '/buy-android-app' },
      ]),
  },
  '/sell-android-app': {
    title: 'Sell Your Android App in India',
    description:
      'Sell your Android app in India. List your Play Store app with downloads and revenue on NexMarket and reach buyers paying in INR.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Sell Your Android App', path: '/sell-android-app' },
      ]),
  },
  '/online-businesses': {
    title: 'Online Businesses for Sale in India',
    description:
      'Online businesses for sale in India. Buy and sell websites and Android apps on NexMarket — an INR marketplace for digital projects.',
    jsonLd: (origin) =>
      breadcrumbLd(origin, [
        { name: 'Home', path: '/' },
        { name: 'Online Businesses for Sale', path: '/online-businesses' },
      ]),
  },
};

export function listingImage(listing) {
  const shot = (listing.screenshots || []).find((s) => /^https?:\/\//.test(s));
  return shot || DEFAULT_IMAGE;
}

export function listingMeta(listing, origin) {
  const isApp = listing.type === 'app';
  const marketCfg = MARKET_TYPES[listing.type] || null;
  const groupLabel = marketCfg ? marketCfg.label : isApp ? 'Android Apps' : 'Websites';
  const typeName = marketCfg ? marketCfg.singular : isApp ? 'Android App' : 'Website';
  const groupPath = marketCfg ? marketCfg.route : isApp ? '/apps' : '/websites';
  const category = listing.category?.split('&')[0]?.trim() || listing.category || '';
  const path = `/listing/${listing.id}`;
  const url = `${origin}${path}`;
  const description = truncate(
    listing.subtitle ||
      listing.description ||
      `${listing.name} is available for ${inr(listing.price)} on NexMarket.`
  );
  const image = listingImage(listing);

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: listing.name,
    description: listing.subtitle || listing.description || description,
    image: [absoluteUrl(image, origin)],
    category: listing.category,
    url,
    brand: { '@type': 'Brand', name: 'NexMarket' },
    offers: {
      '@type': 'Offer',
      url,
      price: Number(listing.price) || 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Person', name: listing.seller?.name || 'Seller' },
    },
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: groupLabel,
        item: `${origin}${groupPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category,
        item: `${origin}${groupPath}?category=${encodeURIComponent(listing.category || '')}`,
      },
      { '@type': 'ListItem', position: 4, name: listing.name, item: url },
    ],
  };

  return {
    title: `${listing.name} ${typeName} for Sale — ${inr(listing.price)}`,
    description,
    image,
    type: 'product',
    path,
    jsonLd: [productLd, breadcrumb],
  };
}

export function buildMeta(pathname, preload, origin) {
  if (preload && preload.listing && pathname.startsWith('/listing/')) {
    const meta = listingMeta(preload.listing, origin);
    if (meta) return meta;
  }
  const base = ROUTE_META[pathname];
  if (base) {
    return {
      title: base.title,
      description: base.description,
      image: DEFAULT_IMAGE,
      type: 'website',
      path: pathname,
      jsonLd: typeof base.jsonLd === 'function' ? base.jsonLd(origin) : base.jsonLd,
    };
  }
  return {
    title: '',
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    type: 'website',
    path: pathname,
    jsonLd: null,
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderHead(meta, origin) {
  const title = fullTitle(meta.title);
  const description = truncate(meta.description || DEFAULT_DESCRIPTION);
  const canonical = `${origin}${meta.path}`;
  const image = absoluteUrl(meta.image, origin);
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${escapeHtml(meta.type || 'website')}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  ];

  const list = meta.jsonLd ? (Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd]) : [];
  for (const obj of list.filter(Boolean)) {
    const json = JSON.stringify(obj).replace(/</g, '\\u003c');
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }

  return tags.join('\n    ');
}
