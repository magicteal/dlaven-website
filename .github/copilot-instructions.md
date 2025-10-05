## dlaven-website — AI agent guide

Big picture

- Monorepo with two apps: `Frontend/` (Next.js 15 App Router, TS, Tailwind) and `Backend/` (Express + MongoDB via Mongoose, TS). Frontend talks to Backend over HTTP; auth is cookie-based (httpOnly `token`).
- Server bootstrapping: `Backend/src/server.ts` wires routes under `/api/*` and enforces CORS via `FRONTEND_ORIGIN` (comma-separated origins). DB connect in `Backend/src/utils/db.ts` reads `MONGODB_URI` (defaults to `mongodb://127.0.0.1:27017/dlaven`).
- Frontend API client: `Frontend/src/lib/api.ts` wraps `fetch` with `credentials: "include"`, logs `[api] …`, and normalizes errors (expects `{ error: string }`).

Dev workflows (PowerShell snippets are typical; adjust if needed)

- Backend: `cd Backend; npm i; $env:MONGODB_URI="mongodb://127.0.0.1:27017/dlaven"; $env:FRONTEND_ORIGIN="http://localhost:3000"; npm run dev` → health at `GET /api/health`.
- Frontend: `cd Frontend; npm i; $env:NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"; npm run dev`.
- Build: Backend `npm run build && npm start` (runs `dist/server.js`); Frontend `npm run build && npm start`.

Auth, roles, and CORS

- JWT stored in cookie `token`. Middleware: `requireAuth` sets `req.user` with `{ sub, email, role }`; `requireAdmin` gates admin routes (`Backend/src/middleware/auth.ts`).
- CORS allowlist from `FRONTEND_ORIGIN` (exact matches). Missing/other origins are rejected (see custom `origin` function in `server.ts`).

REST patterns and responses

- Resource routing: see `/api/products`, `/api/categories`, `/api/cart`, `/api/orders`, `/api/uploads`, `/api/auth`, `/api/admin` under `Backend/src/routes/*`.
- Public GET by slug where applicable (e.g., `GET /api/products/:slug`, `GET /api/categories/:slug`). Admin mutations are `POST/PATCH/DELETE` with `requireAuth + requireAdmin`.
- Standard shapes: list → `{ items, total?, limit?, offset? }`, single → `{ item }`, mutation ok → `{ ok: true }`, errors → `{ error: string }`.

Cart and checkout specifics

- Cart supports guests via `cartId` cookie and users via `userId`. Endpoints: `GET /api/cart`, `POST /api/cart/items` (body: `{ productSlug, quantity?, size? }`), `PATCH /api/cart/items/:productSlug` (body: `{ quantity, size? }`), `DELETE /api/cart/items/:productSlug` (optional `size` in query or body). See `Backend/src/controllers/cartController.ts`.
- Order flow (Razorpay): `POST /api/orders/create` returns `{ order, razorpayOrder, key }`; `POST /api/orders/verify` requires `{ orderId, paymentId, signature }` and marks order `paid` after signature check. Admin endpoints: `/api/orders/admin/*`. See `Backend/src/controllers/ordersController.ts` and `Backend/src/utils/razorpay.ts`.

Uploads and media

- Admin-only image upload: `POST /api/uploads/image` (multipart, field `file`) streams to Cloudinary. Requires `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (optional `CLOUDINARY_FOLDER`). See `Backend/src/utils/cloudinary.ts`.
- Frontend `next.config.ts` allows Cloudinary domains via `images.remotePatterns`.

Email delivery

- `sendEmail` uses Nodemailer; SMTP host/port from env, user/pass and from-address can be stored in DB `Settings` (admin UI) or env. If SMTP incomplete, emails are logged to console. See `Backend/src/utils/email.ts` and admin routes in `Backend/src/routes/admin.ts`.

Frontend usage patterns

- Use `api.ts` methods (e.g., `api.me()`, `api.addToCart`, `api.createOrder`) instead of raw `fetch`. These already include credentials and consistent error handling.
- Global auth/cart state provided via `src/components/providers/AuthProvider.tsx` and `CartProvider.tsx`; client components consume `useAuth()` / `useCart()`.

Conventions to follow when adding features

- Keep route prefixes under `/api/*`; gate mutations with `requireAuth` and, where needed, `requireAdmin`.
- Prefer Mongoose `.lean()` for read-heavy endpoints; use slugs for public lookups (`Product.slug`, `Category.slug`).
- Match response/error shapes used elsewhere; update `Frontend/src/lib/api.ts` with a typed wrapper for any new endpoint.

Key env vars

- Backend: `PORT`, `MONGODB_URI`, `JWT_SECRET` (and optional `JWT_EXPIRES_IN`), `FRONTEND_ORIGIN`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `RAZORPAY_API_KEY`, `RAZORPAY_API_SECRET`, `CLOUDINARY_*`.
- Frontend: `NEXT_PUBLIC_API_BASE_URL`.

Handy references

- Server: `Backend/src/server.ts`, auth: `Backend/src/middleware/auth.ts`, routes/controllers under `Backend/src/routes/*` and `Backend/src/controllers/*`, models in `Backend/src/models/*`.
- Client API: `Frontend/src/lib/api.ts`, providers in `Frontend/src/components/providers/*`.
