# NexMarket

India-focused marketplace to buy and sell websites and Android apps.

## Categories

- Websites for Sale
- Android Apps for Sale

## Run locally

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

Frontend proxies `/api` to `http://localhost:3001`.

## Admin account

The admin account is created from environment variables, so the credentials are never stored in the repo. Copy `backend/.env.example` to `backend/.env` and set:

```bash
ADMIN_NAME=Admin
ADMIN_EMAIL=youremail@gmail.com
ADMIN_PASSWORD=your-secret-password
```

On startup the backend creates this admin account. On a hosted deploy, set the same variables in the host dashboard instead of a file.

To change the admin password later, update `ADMIN_PASSWORD` and restart/redeploy. The backend re-syncs the admin password from the environment on every startup.

The backend logs which config variables are present at startup, so you can confirm the host is passing them.

## Email OTP

Forgot password sends a 6-digit OTP by email. Copy `backend/.env.example` to `backend/.env` and pick one provider.

### Option A: Resend HTTP API (recommended, works on Render Free)

```bash
RESEND_API_KEY=re_your_api_key
MAIL_FROM=NexMarket <onboarding@resend.dev>
```

`onboarding@resend.dev` works without a verified domain but only delivers to the Resend account owner's email. For other recipients, verify a domain in Resend and use an address on it.

### Option B: SMTP

Gmail needs an App Password, not the normal login password.

```bash
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USER=youremail@gmail.com
export SMTP_PASS=your-app-password
export MAIL_FROM="NexMarket <youremail@gmail.com>"
npm start
```

One account is used for both buying and selling. Free accounts can create 3 listings. After that, ₹100 unlocks 5 extra listings after admin UTR approval.

### Render note

Render Free web services cannot send outbound traffic on ports `25`, `465`, or `587`, so Gmail SMTP will not work on the Free plan. Use Option A (Resend, which sends over HTTPS) instead. SMTP requires a paid instance.
