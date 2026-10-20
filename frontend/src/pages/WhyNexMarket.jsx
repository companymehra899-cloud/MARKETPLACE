import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconUsers,
  IconCube,
  IconShield,
  IconChart,
  IconLaptop,
  IconAndroid,
  IconPerson,
  IconChat,
  IconHandshake,
} from '../components/Icons.jsx';

const REASONS = [
  {
    title: 'Built for India',
    body: 'INR prices, local buyers and sellers, and listings made for the Indian digital market — websites, Android apps and online businesses.',
  },
  {
    title: 'Admin-reviewed listings',
    body: 'Every website and app is reviewed before it goes live. Fake or incomplete listings are rejected so buyers see cleaner inventory.',
  },
  {
    title: 'One account to buy and sell',
    body: 'Create a free NexMarket account once. List your project, send offers, message sellers and manage deals from a single dashboard.',
  },
  {
    title: 'Free to start',
    body: 'Free accounts can create 3 listings. After that, ₹100 unlocks 5 extra listings after admin UTR approval. No listing fee to get started.',
  },
  {
    title: 'Real numbers, not hype',
    body: 'Sellers add traffic, monthly revenue, downloads and screenshots. Buyers can ask for Analytics, Search Console or Play Console proof before paying.',
  },
  {
    title: 'You keep ownership',
    body: 'NexMarket is a marketplace, not a broker that takes your asset. You transfer the domain, hosting or Play Console only after you agree terms.',
  },
];

const BUYER_POINTS = [
  'Browse websites for sale and Android apps for sale with traffic, revenue and INR asking prices.',
  'Filter by category, price and type, then open full listing details before you offer.',
  'Send an offer in INR with a message. Talk to the seller in your dashboard.',
  'Verify Analytics, Search Console or Play Console. Follow safety tips before you pay.',
];

const SELLER_POINTS = [
  'List a website or Android app with price, revenue, traffic or downloads and screenshots.',
  'Wait for admin approval. Approved listings appear on the marketplace and in the sitemap.',
  'Receive offers from buyers looking for profitable websites and Play Store apps in India.',
  'Negotiate, then transfer ownership off-platform. NexMarket never takes your project.',
];

const STEPS = [
  { icon: <IconPerson />, title: 'Create a free account', body: 'Sign up in minutes. One login works for buying and selling.' },
  { icon: <IconCube />, title: 'List or browse', body: 'Sellers list a website or app. Buyers search Websites for Sale and Android Apps for Sale.' },
  { icon: <IconChat />, title: 'Offer and talk', body: 'Send an offer in INR, message the other side, and agree a price.' },
  { icon: <IconHandshake />, title: 'Complete the transfer', body: 'Move the domain, hosting or Play Console using our safety tips.' },
];

const FAQS = [
  {
    q: 'Why choose NexMarket to buy or sell a website in India?',
    a: 'NexMarket is built for India: INR pricing, admin-reviewed listings, and buyers who want websites and Android apps with traffic, revenue and downloads. You keep ownership until you complete the transfer with the other party.',
  },
  {
    q: 'Is NexMarket like Flippa for India?',
    a: 'NexMarket is an India-focused marketplace to buy and sell websites, Android apps and online businesses. Prices and offers are in INR. Deals are completed between buyer and seller after you verify the numbers.',
  },
  {
    q: 'Do I pay a commission on NexMarket?',
    a: 'Listing is free for the first 3 projects. Extra listing packs are ₹100 for 5 listings after admin UTR approval. NexMarket does not take ownership of your website or app.',
  },
  {
    q: 'Are listings checked before they go live?',
    a: 'Yes. Admin reviews every listing. After approval it appears on Websites for Sale or Android Apps for Sale and in the sitemap for Google.',
  },
  {
    q: 'How do buyers stay safe?',
    a: 'Verify traffic, revenue and Play Console screenshots before paying. Use escrow or milestone payments for large transfers. Never share OTPs. Report fake listings from the listing page.',
  },
  {
    q: 'What can I buy or sell on NexMarket?',
    a: 'Websites (blogs, ecommerce, SaaS, news, education) and Android apps with downloads, ratings and monthly revenue. You can also browse vehicles, mobiles, local services and tour packages.',
  },
];

export default function WhyNexMarket() {
  return (
    <div className="why-landing">
      <section className="why-hero">
        <p className="eyebrow">Why NexMarket</p>
        <h1>Why NexMarket is the marketplace to buy and sell websites and apps in India</h1>
        <p className="lede">
          NexMarket is India&apos;s marketplace for websites for sale, Android apps for sale and online businesses.
          List in INR, reach serious buyers, and complete transfers with admin-reviewed listings and clear safety tips.
        </p>
        <div className="why-hero-actions">
          <Link className="btn btn-primary" to="/websites">
            Browse websites for sale
          </Link>
          <Link className="btn btn-outline" to="/sell">
            Sell on NexMarket
          </Link>
        </div>
      </section>

      <section className="trust why-trust">
        <div>
          <IconUsers />
          <div>
            <b>5,000+</b>
            <span>Active users</span>
          </div>
        </div>
        <div>
          <IconCube />
          <div>
            <b>1,000+</b>
            <span>Projects listed</span>
          </div>
        </div>
        <div>
          <IconShield />
          <div>
            <b>Admin review</b>
            <span>Before every listing goes live</span>
          </div>
        </div>
        <div>
          <IconChart />
          <div>
            <b>INR deals</b>
            <span>Prices and offers in rupees</span>
          </div>
        </div>
      </section>

      <section className="why-section">
        <h2>Why buyers and sellers choose NexMarket</h2>
        <p className="sub">
          A local alternative to global marketplaces — made for Indian websites, Play Store apps and digital projects.
        </p>
        <div className="why-grid">
          {REASONS.map((item) => (
            <article key={item.title} className="why-reason">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section why-split-wrap">
        <div className="why-split">
          <article>
            <span className="why-pill">
              <IconLaptop /> For buyers
            </span>
            <h2>Buy a website or Android app with real numbers</h2>
            <p>
              Open listings with traffic, monthly revenue, downloads and asking price in INR. Send an offer, talk to the
              seller, then verify proof before you pay.
            </p>
            <ul className="static-list">
              {BUYER_POINTS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <Link className="btn btn-primary" to="/apps">
              Browse Android apps for sale
            </Link>
          </article>
          <article>
            <span className="why-pill">
              <IconAndroid /> For sellers
            </span>
            <h2>Sell your website or app to buyers in India</h2>
            <p>
              List free, wait for admin approval, and reach people searching for profitable websites and Play Store apps.
              You keep the asset until the deal closes.
            </p>
            <ul className="static-list">
              {SELLER_POINTS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <Link className="btn btn-primary" to="/sell">
              List your project
            </Link>
          </article>
        </div>
      </section>

      <section className="section how why-how">
        <h2>How NexMarket works</h2>
        <p className="sub">A simple path from listing to ownership transfer.</p>
        <div className="steps">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.title}>
              {index > 0 ? <div className="arrow">›</div> : null}
              <div>
                <div className="step-ico">{step.icon}</div>
                <h3>
                  <span className="num">{index + 1}</span> {step.title}
                </h3>
                <p>{step.body}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="why-section">
        <h2>Safer deals for Indian website and app transfers</h2>
        <p className="sub">NexMarket does not take ownership. Use proof, milestones and our safety checklist.</p>
        <div className="why-safety">
          <div>
            <span className="why-ico safe" />
            <h3>Verify before you pay</h3>
            <p>Ask for Google Analytics, Search Console or Play Console screenshots that match the listing.</p>
          </div>
          <div>
            <span className="why-ico buyers" />
            <h3>Talk on the platform</h3>
            <p>Offers and messages stay in your dashboard so both sides have a record of the negotiation.</p>
          </div>
          <div>
            <span className="why-ico value" />
            <h3>Use milestones for large deals</h3>
            <p>For high-value websites and apps, use escrow or staged payments until the transfer is complete.</p>
          </div>
          <div>
            <span className="why-ico quick" />
            <h3>Report fake listings</h3>
            <p>Flag suspicious ads from the listing page. Admin can reject, unfeature or remove them.</p>
          </div>
        </div>
        <p className="why-safety-link">
          Read the full checklist on <Link to="/safety">Safety Tips</Link>.
        </p>
      </section>

      <section className="section how faq why-faq">
        <h2>Frequently asked questions about NexMarket</h2>
        <p className="sub">Straight answers before you buy or sell a digital project in India.</p>
        <div className="faq-list">
          {FAQS.map((item) => (
            <div key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-wrap">
        <div className="cta">
          <div>
            <h2>Ready to buy or sell on NexMarket?</h2>
            <p>Create a free account, browse websites and apps for sale, or list your project in INR.</p>
          </div>
          <Link to="/register" className="btn btn-primary cta-btn">
            Get started free
          </Link>
        </div>
      </section>

      <section className="section seo-market">
        <h2>Why NexMarket for websites, Android apps and online businesses in India</h2>
        <p>
          NexMarket is a digital business marketplace in India where you can{' '}
          <Link to="/buy-website">buy a website</Link>, <Link to="/sell-website">sell your website</Link>,{' '}
          <Link to="/buy-android-app">buy an Android app</Link> and{' '}
          <Link to="/sell-android-app">sell your Play Store app</Link>. Browse{' '}
          <Link to="/websites">websites for sale</Link>, <Link to="/apps">Android apps for sale</Link> and{' '}
          <Link to="/online-businesses">online businesses for sale</Link>, then follow{' '}
          <Link to="/how-it-works">how it works</Link> to send an offer in INR. Why NexMarket: local buyers, admin
          review, free listings to start, and a marketplace that never takes ownership of your project.
        </p>
      </section>
    </div>
  );
}
