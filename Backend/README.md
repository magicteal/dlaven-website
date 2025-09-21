# DLaven Backend (Express + MongoDB)

## Prerequisites
- Node.js 18+
- MongoDB running locally (default URI: `mongodb://127.0.0.1:27017/dlaven`)

## Setup
```bash
cd Backend
npm install
cp .env.example .env
# edit .env as needed
npm run dev
```

Server runs by default on `http://localhost:4000`.

## Endpoints
- POST `/api/auth/register` { email, password, name? }
- POST `/api/auth/login` { email, password }
- POST `/api/auth/logout`
- GET `/api/auth/me` (requires auth)

Auth is cookie-based (`token` httpOnly cookie). CORS is configured via `FRONTEND_ORIGIN`.

## Email (Password Reset)

Configure SMTP to send real emails (optional). If not set, emails are logged to the console.

Env variables:

```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
MAIL_FROM="DLaven <no-reply@dlaven.local>"
```

For local dev, a mailcatcher like MailHog (port 1025) is convenient.
