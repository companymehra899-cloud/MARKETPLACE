import React from 'react';

export default function PageLayout({ children, className = '' }) {
  return (
    <div className={`page ${className}`.trim()}>
      <div className="page-inner">{children}</div>
    </div>
  );
}
