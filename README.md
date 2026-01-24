# D’ LAVÉN

A full-stack Next.js + Express/Mongo monorepo for D’ LAVÉN with authentication, admin panel, and email settings.

## Structure

- `Frontend/` — Next.js App Router site (TypeScript, Tailwind)
- `Backend/` — Express + MongoDB API (TypeScript, JWT via httpOnly cookie)

## Quick start (development)

Open two terminals and run Frontend and Backend separately.

### 1) Backend

1. Create `.env` in `Backend/`:

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/dlaven
JWT_SECRET=dev_super_secret
# Allow your frontend origins (comma-separated)
FRONTEND_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
# Optional email defaults (can be configured in Admin > Settings)
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
```

2. Install and run:

```powershell
cd Backend
npm install
npm run dev
```

Backend will start on `http://localhost:4000`.

### 2) Frontend

```powershell
cd Frontend
npm install
# If your backend runs elsewhere, set NEXT_PUBLIC_API_BASE
$env:NEXT_PUBLIC_API_BASE="http://localhost:4000"
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Features

- Auth: register, login, logout, reset password via email
- Roles: user and admin (admin-only UI and routes)
- Admin panel: side navigation with tabs (Profile default), Users, Settings
- Email settings: configure SMTP in Admin > Settings and send test email
- Product UI: catalog, categories, product details with gallery

## Admin usage

- Access: `http://localhost:3000/admin`
- Default tab: Profile (`/admin/profile`)
- Users management: list, promote/demote admin, delete
- Settings: SMTP user/pass and mail-from; send a test email

## Notes & tips

- CORS: ensure `FRONTEND_ORIGIN` contains the exact frontend origin(s)
- Cookies: API client uses `credentials: include` and `cache: no-store`
- SMTP (Gmail): use an App Password, not your main password
- If emails aren’t arriving, check spam and provider logs

## Scripts

- Frontend: `npm run dev`, `npm run build`, `npm start`
- Backend: `npm run dev`, `npm run build`, `npm start`

## License

Proprietary — internal project use only.