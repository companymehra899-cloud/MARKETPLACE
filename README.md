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

## Email OTP

Forgot password sends a 6-digit OTP by email. Copy `backend/.env.example` to `backend/.env` and set SMTP values.

Gmail needs an App Password, not the normal login password. Then start the backend with those env vars, for example:

```bash
cd backend
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USER=youremail@gmail.com
export SMTP_PASS=your-app-password
export MAIL_FROM="NexMarket <youremail@gmail.com>"
npm start
```

One account is used for both buying and selling. Free accounts can create 3 listings. After that, ₹100 unlocks 5 extra listings after admin UTR approval.
