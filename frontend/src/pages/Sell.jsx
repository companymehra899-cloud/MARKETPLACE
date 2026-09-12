import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import PageLayout from '../components/PageLayout.jsx';

const empty = {
  type: 'website',
  name: '',
  category: 'Tools & Utilities',
  price: '',
  monthlyRevenue: '',
  traffic: '',
  downloads: '',
  description: '',
  techStack: '',
  contact: '',
};

const WEB_CATS = [
  'Tools & Utilities',
  'Blog',
  'E-commerce',
  'News & Media',
  'Education',
  'Finance',
  'Health & Fitness',
  'Travel & Lifestyle',
  'Food & Recipes',
  'Technology',
  'Custom',
];

const APP_CATS = [
  'Education',
  'Finance',
  'Health & Fitness',
  'Productivity',
  'Entertainment',
  'Lifestyle',
  'Games',
  'Tools',
  'Business',
  'Social',
  'Travel & Local',
  'Food & Drink',
  'Photography',
  'Weather',
  'Custom',
];

export default function Sell() {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [customCategory, setCustomCategory] = useState('');
  const fileRef = useRef(null);
  const navigate = useNavigate();

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    const room = Math.max(0, 5 - images.length);
    const next = files.slice(0, room).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...next]);
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await api('/api/listings', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          screenshots: images.map((img) => img.url),
        }),
      });
      navigate(`/listing/${data.listing.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  const isApp = form.type === 'app';
  const cats = isApp ? APP_CATS : WEB_CATS;
  const descLen = form.description.length;

  return (
    <PageLayout className="sell-page">
      <header className="sell-head">
        <div>
          <h1>Sell Your Project</h1>
          <p>List your website or Android app</p>
          <p className="lede">Reach thousands of potential buyers. Admin reviews every listing before it goes live.</p>
        </div>
        <div className="sell-reach">
          <div className="reach-win">
            <span className="reach-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="reach-ico">↑</span>
          </div>
          <div>
            <strong>Reach the Right Buyers</strong>
            <small>List once, get noticed.</small>
          </div>
        </div>
      </header>

      <div className="sell-layout">
        <form className="form sell-card" onSubmit={submit}>
          <label>Project type</label>
          <div className="type-cards">
            <button
              type="button"
              className={!isApp ? 'on' : ''}
              onClick={() => {
                setCustomCategory('');
                setForm((f) => ({ ...f, type: 'website', category: 'Tools & Utilities' }));
              }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="12" rx="2" />
                <path d="M2 19h20" />
              </svg>
              Website
            </button>
            <button
              type="button"
              className={isApp ? 'on' : ''}
              onClick={() => {
                setCustomCategory('');
                setForm((f) => ({ ...f, type: 'app', category: 'Education' }));
              }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M17 7l2.2-3.2M7 7L4.8 3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" fill="none" />
                <rect x="5" y="8" width="14" height="11" rx="3" fill="currentColor" />
                <circle cx="9" cy="12.5" r="1.1" fill="#fff" />
                <circle cx="15" cy="12.5" r="1.1" fill="#fff" />
              </svg>
              Android App
            </button>
          </div>

          <label>Name</label>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} required />

          <label>Category</label>
          <select
            value={form.category === 'Custom' || customCategory ? 'Custom' : form.category}
            onChange={(e) => {
              if (e.target.value === 'Custom') {
                setCustomCategory('');
                set('category', 'Custom');
              } else {
                setCustomCategory('');
                set('category', e.target.value);
              }
            }}
            required
          >
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {(form.category === 'Custom' || customCategory) && (
            <input
              className="custom-category"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                set('category', e.target.value || 'Custom');
              }}
              placeholder="Enter your category"
              required
            />
          )}

          <div className="row">
            <div>
              <label>Asking price (INR)</label>
              <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} required />
            </div>
            <div>
              <label>Monthly revenue (INR)</label>
              <input
                type="number"
                value={form.monthlyRevenue}
                onChange={(e) => set('monthlyRevenue', e.target.value)}
              />
            </div>
          </div>

          {isApp ? (
            <>
              <label>Downloads</label>
              <input
                value={form.downloads}
                onChange={(e) => set('downloads', e.target.value)}
                placeholder="10K+"
              />
            </>
          ) : (
            <>
              <label>Monthly visitors</label>
              <input
                value={form.traffic}
                onChange={(e) => set('traffic', e.target.value)}
                placeholder="12K/month"
              />
            </>
          )}

          <label>Description</label>
          <div className="desc-wrap">
            <textarea
              rows="5"
              value={form.description}
              maxLength={300}
              onChange={(e) => set('description', e.target.value)}
              required
            />
            <small>{descLen}/300</small>
          </div>

          <label>Upload Screenshots</label>
          <div
            className="upload-box"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onFiles(e.dataTransfer.files);
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              hidden
              onChange={(e) => {
                onFiles(e.target.files);
                e.target.value = '';
              }}
            />
            {images.length ? (
              <div className="upload-previews">
                {images.map((img, i) => (
                  <figure key={img.url}>
                    <img src={img.url} alt={img.name} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                    >
                      ×
                    </button>
                  </figure>
                ))}
                {images.length < 5 && <span className="upload-more">+ Add more</span>}
              </div>
            ) : (
              <>
                <span className="upload-ico">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="1.7">
                    <rect x="3" y="5" width="18" height="14" rx="3" />
                    <circle cx="8.5" cy="10" r="1.5" />
                    <path d="M21 16l-5-5-8 8" />
                  </svg>
                </span>
                <b>Click to upload images</b>
                <em>PNG, JPG (Max 5 images)</em>
              </>
            )}
          </div>

          <label>Tech stack (comma separated)</label>
          <input
            value={form.techStack}
            onChange={(e) => set('techStack', e.target.value)}
            placeholder="React, Node.js, MongoDB"
          />
          <label>Contact email</label>
          <input value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="you@email.com" />
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary sell-submit" type="submit">
            List Your Project →
          </button>
        </form>

        <aside className="sell-side">
          <div className="why-card">
            <h3>Why Sell on NexMarket?</h3>
            <div>
              <span className="why-ico buyers" />
              Genuine Buyers
            </div>
            <div>
              <span className="why-ico safe" />
              Safe &amp; Secure
            </div>
            <div>
              <span className="why-ico quick" />
              Quick Listing
            </div>
            <div>
              <span className="why-ico value" />
              Better Value
            </div>
          </div>
          <div className="help-card">
            <h3>
              <span className="help-ico">?</span>
              Need Help?
            </h3>
            <p>If you have any questions, feel free to contact us.</p>
            <Link to="/contact" className="btn btn-outline help-btn">
              Contact Support
            </Link>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
