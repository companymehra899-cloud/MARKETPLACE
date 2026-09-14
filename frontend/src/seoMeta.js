import { inr } from './format.js';

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

export function listingImage(listing) {
  const shot = (listing.screenshots || []).find((s) => /^https?:\/\//.test(s));
  return shot || DEFAULT_IMAGE;
}

export function listingMeta(listing, origin) {
  const isApp = listing.type === 'app';
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
        name: isApp ? 'Android Apps' : 'Websites',
        item: `${origin}${isApp ? '/apps' : '/websites'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category,
        item: `${origin}${isApp ? '/apps' : '/websites'}?category=${encodeURIComponent(listing.category || '')}`,
      },
      { '@type': 'ListItem', position: 4, name: listing.name, item: url },
    ],
  };

  return {
    title: `${listing.name} — ${inr(listing.price)}`,
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
