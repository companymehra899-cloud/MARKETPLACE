import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';

const GUIDES = {
  'buy-website': {
    eyebrow: 'Buy a website',
    title: 'Buy a Website in India',
    lede: 'Browse profitable websites for sale with traffic, monthly revenue and asking price in INR. Make an offer and talk to the seller on NexMarket.',
    cta: { to: '/websites', label: 'Browse websites for sale' },
    sections: [
      {
        heading: 'Why buy a website instead of building one?',
        body: 'A live website already has a domain, content, traffic and often revenue. You skip months of setup and start from real numbers — monthly visitors, ads, affiliates or product sales.',
      },
      {
        heading: 'What to check before you buy',
        bullets: [
          'Monthly traffic and where it comes from (Google, social, direct).',
          'Monthly revenue and how it is earned (AdSense, affiliate, SaaS, ecommerce).',
          'Domain age, platform (WordPress, Shopify, custom) and what is included in the sale.',
          'Talk to the seller, ask for Analytics or Search Console proof, then agree a price in INR.',
        ],
      },
      {
        heading: 'Popular website types on NexMarket',
        body: 'Blogs, content sites, ecommerce stores, SaaS tools, news portals, education sites and niche directories. Filter by category, price and revenue on the websites marketplace.',
      },
    ],
    faqs: [
      {
        q: 'How do I buy a website on NexMarket?',
        a: 'Open a listing, review traffic and revenue, send an offer in INR, then complete the domain and hosting transfer with the seller using our safety tips.',
      },
      {
        q: 'Are websites for sale in India priced in INR?',
        a: 'Yes. Asking prices and offers on NexMarket are in Indian Rupees so local buyers and sellers can deal without FX confusion.',
      },
    ],
  },
  'sell-website': {
    eyebrow: 'Sell a website',
    title: 'Sell Your Website in India',
    lede: 'List your website for free, reach buyers looking for traffic and revenue, and negotiate the sale in INR. Admin reviews every listing before it goes live.',
    cta: { to: '/sell', label: 'List your website' },
    sections: [
      {
        heading: 'How to sell a website on NexMarket',
        bullets: [
          'Create a free account and open Sell Your Project.',
          'Add name, category, asking price, monthly revenue, traffic and screenshots.',
          'Wait for admin approval. The listing then appears on Websites for Sale.',
          'Buyers send offers. You chat, agree a price, then transfer the domain and assets.',
        ],
      },
      {
        heading: 'What buyers look for',
        body: 'Clear traffic, honest revenue, a working live URL, screenshots and a fair asking price. Sites with 6+ months of history and documented monetization sell faster.',
      },
      {
        heading: 'Listing is free to start',
        body: 'Free accounts can create 3 listings. After that, ₹100 unlocks 5 extra listings after admin UTR approval. NexMarket does not take ownership of your site.',
      },
    ],
    faqs: [
      {
        q: 'How much does it cost to sell a website?',
        a: 'Listing is free for the first 3 projects. Extra listing packs are ₹100 for 5 listings after admin approval of your UTR.',
      },
      {
        q: 'When will my website listing go live?',
        a: 'After admin review. Approved listings show on Websites for Sale and in the sitemap for Google.',
      },
    ],
  },
  'buy-android-app': {
    eyebrow: 'Buy an Android app',
    title: 'Buy an Android App in India',
    lede: 'Find Android apps for sale with downloads, ratings, Play Console data and monthly revenue. Send an offer and take over a live Play Store listing.',
    cta: { to: '/apps', label: 'Browse Android apps for sale' },
    sections: [
      {
        heading: 'Why buy an Android app?',
        body: 'A published app already has a package name, store listing, users and reviews. You buy distribution instead of starting from zero on Google Play.',
      },
      {
        heading: 'What to verify before you buy',
        bullets: [
          'Installs, ratings and reviews on Google Play.',
          'Monthly revenue (ads, IAP, subscriptions) and Play Console screenshots.',
          'Source code, Firebase/backend access and what transfers with the sale.',
          'Never pay until you have verified the Play Console and agreed transfer steps.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I buy a Play Store app in India?',
        a: 'Yes. NexMarket lists Android apps with downloads and revenue. You and the seller complete the Play Console transfer after agreeing a price in INR.',
      },
      {
        q: 'Does NexMarket transfer the app for me?',
        a: 'No. NexMarket is the marketplace. Use our safety tips and verify Play Console before you pay.',
      },
    ],
  },
  'sell-android-app': {
    eyebrow: 'Sell an Android app',
    title: 'Sell Your Android App in India',
    lede: 'List your Play Store app with downloads, revenue and screenshots. Reach buyers who want ready-made Android projects priced in INR.',
    cta: { to: '/sell', label: 'List your Android app' },
    sections: [
      {
        heading: 'How to sell an Android app',
        bullets: [
          'Create an account and choose Android app when you list.',
          'Add category, price, monthly revenue, downloads, app size and screenshots.',
          'Admin reviews the listing. After approval it appears on Android Apps for Sale.',
          'Buyers send offers. You negotiate, then transfer Play Console and source code.',
        ],
      },
      {
        heading: 'What helps an app sell',
        body: 'Real download numbers, Play Console proof, a clear monetization model and an honest description of maintenance needed.',
      },
    ],
    faqs: [
      {
        q: 'Can I sell a Play Store app on NexMarket?',
        a: 'Yes. List the app, wait for approval, then talk to buyers in your dashboard.',
      },
      {
        q: 'Do I keep the app until the deal closes?',
        a: 'Yes. NexMarket never takes ownership. You transfer the listing only after you agree terms with the buyer.',
      },
    ],
  },
  'online-businesses': {
    eyebrow: 'Online businesses',
    title: 'Online Businesses for Sale in India',
    lede: 'NexMarket is an India-focused marketplace to buy and sell websites, Android apps and digital projects — a local alternative to Flippa and Acquire.com, with prices in INR.',
    cta: { to: '/websites', label: 'View all listings' },
    sections: [
      {
        heading: 'Websites, apps and digital projects',
        body: 'Buyers search for profitable websites, content blogs, ecommerce stores, SaaS tools and Android apps. Sellers list once and reach people looking to buy an online business in India.',
      },
      {
        heading: 'How NexMarket compares',
        bullets: [
          'Built for India: INR pricing, local buyers and sellers.',
          'Admin-reviewed listings before they go public.',
          'One account to buy and sell.',
          'Free to start — 3 listings included.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Is NexMarket like Flippa for India?',
        a: 'NexMarket is a marketplace to buy and sell websites and Android apps with INR prices and admin review. Deals are completed between buyer and seller.',
      },
      {
        q: 'What can I buy or sell?',
        a: 'Websites (blogs, stores, SaaS, news, education) and Android apps with downloads and revenue.',
      },
    ],
  },
};

export default function Guides({ kind }) {
  const page = GUIDES[kind] || GUIDES['online-businesses'];
  return (
    <PageLayout className="guide-page">
      <p className="eyebrow">{page.eyebrow}</p>
      <h1>{page.title}</h1>
      <p className="lede">{page.lede}</p>
      <Link className="btn btn-primary" to={page.cta.to}>
        {page.cta.label}
      </Link>
      {page.sections.map((section) => (
        <section key={section.heading} className="guide-block">
          <h2>{section.heading}</h2>
          {section.body && <p>{section.body}</p>}
          {section.bullets && (
            <ul className="static-list">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {page.faqs && (
        <section className="guide-block">
          <h2>Frequently asked questions</h2>
          <div className="faq-list guide-faq">
            {page.faqs.map((item) => (
              <div key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="guide-links">
        <Link to="/buy-website">Buy a website</Link>
        <Link to="/sell-website">Sell a website</Link>
        <Link to="/buy-android-app">Buy an Android app</Link>
        <Link to="/sell-android-app">Sell an Android app</Link>
        <Link to="/online-businesses">Online businesses for sale</Link>
      </div>
    </PageLayout>
  );
}
