import React from 'react';

export default function Cover({ listing, className = '' }) {
  const name = listing?.name || '';
  const cover = listing?.cover || '';
  if (cover === 'travel' || name === 'Travel Guide Blog') {
    return (
      <div className={`cover travel ${className}`}>
        <span>Explore The World</span>
      </div>
    );
  }
  if (cover === 'study' || name === 'Study Master') {
    return (
      <div className={`cover study ${className}`}>
        <div>
          <b>Study Master</b>
          <small>Learn Today Build Your Tomorrow</small>
        </div>
        <div className="phone-mini" />
      </div>
    );
  }
  if (cover === 'food' || name === 'Recipe World') {
    return (
      <div className={`cover food ${className}`}>
        <b>Good Food Home</b>
      </div>
    );
  }
  if (cover === 'ludo' || name === 'Ludo Star') {
    return (
      <div className={`cover ludo ${className}`}>
        <b>LUDO KING</b>
      </div>
    );
  }
  if (cover === 'plants' || name === 'GreenKart Store') {
    return (
      <div className={`cover plants ${className}`}>
        <b>Bring Nature Home</b>
      </div>
    );
  }
  if (cover === 'finance' || name === 'Expense Tracker') {
    return (
      <div className={`cover finance ${className}`}>
        <span /><span />
      </div>
    );
  }
  return (
    <div className={`cover generic ${className} ${listing?.type === 'app' ? 'app' : ''}`}>
      <b>{name.split(' ')[0]}</b>
    </div>
  );
}
