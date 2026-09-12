import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="brand">
      <svg className="brand-mark" viewBox="0 0 36 36" aria-hidden="true">
        <rect width="36" height="36" rx="8" fill="#1d4ed8" />
        <path d="M9 8h6.2l11.8 14.2V8H33v20h-6.2L15 13.8V28H9V8z" fill="#fff" />
      </svg>
      <span>
        <strong>NexMarket</strong>
        <small>Buy. Sell. Grow.</small>
      </span>
    </Link>
  );
}
