import React from 'react';

function Phones({ tone = 'green', screens }) {
  return (
    <div className={`cover-phones ${tone}`}>
      {screens.map((s, i) => (
        <div className={`cphone c${i + 1}`} key={i} style={{ background: s.bg }}>
          <i className="notch" />
          {s.rows}
        </div>
      ))}
    </div>
  );
}

export default function Cover({ listing, className = '' }) {
  const name = listing?.name || '';
  const cover = listing?.cover || '';
  const cls = `cover-shot ${className}`.trim();

  if (cover === 'taskflow' || name === 'TaskFlow Pro' || name === 'PDF Tools Pro') {
    return (
      <div className={`${cls} shot-taskflow`}>
        <div className="shot-top">
          <b>TaskFlow</b>
          <nav>
            <span />
            <span />
            <span />
          </nav>
        </div>
        <div className="shot-hero">
          <div>
            <h4>Make Productivity Simple</h4>
            <em>Get Started</em>
          </div>
          <div className="shot-ui">
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
    );
  }

  if (cover === 'travel' || name === 'Travel Guide Blog') {
    return (
      <div className={`${cls} shot-travel`}>
        <div className="shot-top light">
          <b>TravelMate</b>
          <nav>
            <span />
            <span />
            <span />
          </nav>
        </div>
        <div className="shot-caption">Explore The World</div>
      </div>
    );
  }

  if (cover === 'food' || name === 'Recipe World') {
    return (
      <div className={`${cls} shot-food`}>
        <div className="shot-top light">
          <b>FoodieHub</b>
          <nav>
            <span />
            <span />
          </nav>
        </div>
        <div className="shot-caption">Good Food Better Mood</div>
      </div>
    );
  }

  if (cover === 'plants' || name === 'GreenKart Store') {
    return (
      <div className={`${cls} shot-plants`}>
        <div className="shot-top light">
          <b>GreenKart</b>
          <nav>
            <span />
            <span />
          </nav>
        </div>
        <div className="shot-caption dark">Bring Nature Home</div>
      </div>
    );
  }

  if (cover === 'aitify' || name === 'Aitify Hub') {
    return (
      <div className={`${cls} shot-aitify`}>
        <div className="shot-top dark">
          <b>Aitify</b>
          <nav>
            <span />
            <span />
          </nav>
        </div>
        <div className="shot-hero dark">
          <div>
            <h4>AI Tools for Everyone</h4>
            <em>Try Now</em>
          </div>
          <div className="shot-ui dark">
            <i />
            <i />
          </div>
        </div>
      </div>
    );
  }

  if (cover === 'newsportal' || name === 'News Portal') {
    return (
      <div className={`${cls} shot-news`}>
        <div className="shot-top dark">
          <b>NewsPortal</b>
        </div>
        <div className="shot-caption">Daily News Trusted &amp; Updated</div>
        <div className="news-grid">
          <i />
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }

  if (cover === 'studynest' || name === 'StudyNest') {
    return (
      <div className={`${cls} shot-studynest`}>
        <div className="shot-top light">
          <b>StudyNest</b>
        </div>
        <div className="shot-caption dark">Learn Without Limits</div>
      </div>
    );
  }

  if (cover === 'finflow' || name === 'FinFlow Blog') {
    return (
      <div className={`${cls} shot-finflow`}>
        <div className="shot-top dark">
          <b>FinFlow</b>
        </div>
        <div className="shot-hero dark">
          <div>
            <h4>Smarter Financial Decisions</h4>
            <em>Open Account</em>
          </div>
          <div className="shot-ui dark">
            <i />
            <i />
          </div>
        </div>
      </div>
    );
  }

  if (cover === 'habit' || name === 'Habit Tracker Pro') {
    return (
      <div className={`${cls} app-cover is-habit`}>
        <div className="app-badge green">
          <svg viewBox="0 0 48 48" width="34" height="34">
            <path d="M24 8c8 8 14 14 14 22a14 14 0 1 1-28 0c0-8 6-14 14-22z" fill="#fff" />
            <path d="M18 26c2 3 4 6 6 8 4-8 8-12 10-14" stroke="#22c55e" strokeWidth="3" fill="none" />
          </svg>
        </div>
        <Phones
          tone="green"
          screens={[
            {
              bg: '#ecfdf3',
              rows: (
                <>
                  <b />
                  <span />
                  <span />
                  <span />
                </>
              ),
            },
            {
              bg: '#dcfce7',
              rows: (
                <>
                  <b />
                  <span />
                  <span />
                </>
              ),
            },
          ]}
        />
      </div>
    );
  }

  if (cover === 'study' || name === 'Study Master') {
    return (
      <div className={`${cls} app-cover is-study`}>
        <div className="app-badge purple">
          <svg viewBox="0 0 48 48" width="32" height="32">
            <path d="M8 20l16-8 16 8-16 8-16-8z" fill="#fff" />
            <path d="M14 24v8c4 3 7 4 10 4s6-1 10-4v-8" stroke="#fff" strokeWidth="2.4" fill="none" />
          </svg>
        </div>
        <Phones
          tone="purple"
          screens={[
            { bg: '#eef2ff', rows: (<><b /><span /><span /></>) },
            { bg: '#ddd6fe', rows: (<><b /><span /><span /></>) },
          ]}
        />
      </div>
    );
  }

  if (cover === 'finance' || name === 'Expense Tracker') {
    return (
      <div className={`${cls} app-cover is-finance`}>
        <div className="app-badge orange">₹</div>
        <Phones
          tone="dark"
          screens={[
            { bg: '#0f172a', rows: (<><b /><span /><span /></>) },
            { bg: '#1e293b', rows: (<><b /><span /><span /></>) },
          ]}
        />
      </div>
    );
  }

  if (cover === 'photo' || name === 'Photo Editor Pro') {
    return (
      <div className={`${cls} app-cover is-photoed`}>
        <div className="app-badge grape">
          <svg viewBox="0 0 48 48" width="30" height="30" fill="none" stroke="#fff" strokeWidth="3">
            <circle cx="24" cy="24" r="8" />
            <rect x="8" y="14" width="32" height="24" rx="6" />
            <path d="M16 14l2-4h12l2 4" />
          </svg>
        </div>
        <div className="photo-strip">
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }

  if (cover === 'ludo' || name === 'Ludo Star') {
    return (
      <div className={`${cls} app-cover is-ludo`}>
        <div className="ludo-king">♔</div>
        <div className="ludo-boards">
          <i />
          <i />
        </div>
      </div>
    );
  }

  if (cover === 'weather' || name === 'Weather Live') {
    return (
      <div className={`${cls} app-cover is-weather`}>
        <div className="app-badge sky">☁</div>
        <Phones
          tone="sky"
          screens={[
            { bg: '#e0f2fe', rows: (<><b /><span /><span /></>) },
            { bg: '#bae6fd', rows: (<><b /><span /><span /></>) },
          ]}
        />
      </div>
    );
  }

  if (cover === 'recipebook' || name === 'Recipe Book') {
    return (
      <div className={`${cls} app-cover is-recipes`}>
        <div className="app-badge rose">🍴</div>
        <div className="photo-strip food">
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }

  if (cover === 'planner' || name === 'Daily Planner') {
    return (
      <div className={`${cls} app-cover is-planner`}>
        <div className="app-badge teal">✓</div>
        <Phones
          tone="teal"
          screens={[
            { bg: '#ecfeff', rows: (<><b /><span /><span /><span /></>) },
            { bg: '#ccfbf1', rows: (<><b /><span /><span /></>) },
          ]}
        />
      </div>
    );
  }

  return (
    <div className={`${cls} shot-generic ${listing?.type === 'app' ? 'app' : ''}`}>
      <b>{name.split(' ')[0]}</b>
    </div>
  );
}
