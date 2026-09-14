const nodemailer = require('nodemailer');

function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
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

async function sendOtpEmail(to, code) {
  if (!mailConfigured()) {
    const err = new Error('Email is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASS.');
    err.status = 503;
    throw err;
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  await transporter().sendMail({
    from,
    to,
    subject: 'NexMarket password reset OTP',
    text: `Your NexMarket OTP is ${code}. It is valid for 10 minutes. Do not share this code.`,
    html: `<p>Your NexMarket OTP is <strong>${code}</strong>.</p><p>It is valid for 10 minutes. Do not share this code.</p>`,
  });
}

module.exports = { mailConfigured, sendOtpEmail };
