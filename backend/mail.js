const nodemailer = require('nodemailer');

function resendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function mailConfigured() {
  return resendConfigured() || smtpConfigured();
}

function mailProvider() {
  if (resendConfigured()) return 'resend (HTTP API)';
  if (smtpConfigured()) return 'smtp';
  return 'none';
}

function mailFrom() {
  return (
    process.env.MAIL_FROM ||
    process.env.SMTP_USER ||
    'NexMarket <onboarding@resend.dev>'
  );
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_PORT || '587') === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendViaResend(to, subject, text, html) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: mailFrom(), to: [to], subject, text, html }),
  });
  if (!res.ok) {
    let detail = '';
    try {
      const body = await res.json();
      detail = body && body.message ? `: ${body.message}` : '';
    } catch (err) {
      detail = '';
    }
    const error = new Error(`Resend API error (${res.status})${detail}`);
    error.status = 502;
    throw error;
  }
}

async function sendViaSmtp(to, subject, text, html) {
  await transporter().sendMail({ from: mailFrom(), to, subject, text, html });
}

async function sendMail(to, subject, text, html) {
  if (resendConfigured()) {
    await sendViaResend(to, subject, text, html);
    return;
  }
  if (smtpConfigured()) {
    await sendViaSmtp(to, subject, text, html);
    return;
  }
  const err = new Error(
    'Email is not configured. Set RESEND_API_KEY, or SMTP_HOST, SMTP_USER and SMTP_PASS.'
  );
  err.status = 503;
  throw err;
}

async function sendOtpEmail(to, code) {
  const subject = 'NexMarket password reset OTP';
  const text = `Your NexMarket OTP is ${code}. It is valid for 10 minutes. Do not share this code.`;
  const html = `<p>Your NexMarket OTP is <strong>${code}</strong>.</p><p>It is valid for 10 minutes. Do not share this code.</p>`;
  await sendMail(to, subject, text, html);
}

module.exports = { mailConfigured, mailProvider, sendMail, sendOtpEmail };
