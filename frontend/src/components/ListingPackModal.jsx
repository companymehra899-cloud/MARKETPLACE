import React, { useState } from 'react';
import { api } from '../api';

export default function ListingPackModal({ pack, onClose, onSubmitted }) {
  const [utr, setUtr] = useState('');
  const [payerName, setPayerName] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = pack?.pendingPayment;

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(pack.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/api/payments/utr', {
        method: 'POST',
        body: JSON.stringify({ utr, payerName }),
      });
      onSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal pay-modal" onClick={onClose} role="presentation">
      <div className="modal-card pay-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="pay-close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <p className="eyebrow">Unlock 5 extra listings</p>
        <h2>Pay ₹{pack.amount} via UPI</h2>
        <p className="lede">
          Scan the QR or pay to the UPI ID, then submit your UTR and the name shown on the payment.
        </p>
        <img className="pay-qr" src={pack.qrImage || '/qr-code.png'} alt="UPI QR code" />
        <div className="pay-upi">
          <div>
            <small>UPI ID</small>
            <strong>{pack.upiId}</strong>
          </div>
          <button className="btn btn-outline" type="button" onClick={copyUpi}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p className="pay-note">
          Amount locked at ₹{pack.amount} · {pack.upiName} · {pack.slots} listings after admin approval
        </p>
        {pending ? (
          <div className="pay-pending">
            <strong>Payment under review</strong>
            <p>
              UTR {pending.utr} · {pending.payerName}. Extra listings unlock after admin approval.
            </p>
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <label>UTR / UPI reference number</label>
            <input
              value={utr}
              onChange={(e) => setUtr(e.target.value.toUpperCase())}
              placeholder="12-character UTR"
              maxLength={12}
              required
            />
            <label>Payment profile name</label>
            <input
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              placeholder="Name shown on UPI payment"
              required
            />
            {error && <p className="error">{error}</p>}
            <button className="btn btn-primary full" type="submit" disabled={busy}>
              {busy ? 'Submitting...' : 'Submit for approval'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
