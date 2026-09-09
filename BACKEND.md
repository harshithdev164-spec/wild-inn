# Backend / deployment

The backend is **`serve.js`** — an Express server that serves the built site (`dist/`)
**and** the whole API (`/api/reels`, `/api/packages`, `/api/checkout/*`, `/api/admin/*`).
There is no separate service to build. In dev, the same API runs inside Vite
(`npm run dev`), so you never need two processes locally.

## Why it needs a host

`/api/checkout/*` creates Razorpay orders with the secret key and verifies payment
signatures — that must run server-side. `/api/admin/*` and price editing need the DB.
A plain static host (like the current AI Studio deploy) can't run any of this, which is
why the admin login shows *"Could not reach the server"* there.

## Deploy to Render (recommended, has a free tier)

1. Push this repo to GitHub.
2. Render → **New → Blueprint** → select the repo. It reads [`render.yaml`](./render.yaml).
3. When prompted, paste the 4 secrets:
   - `DATABASE_URL` — Neon pooled connection string (from `.env.local`)
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
   - `ADMIN_PASSCODE`
4. Deploy. Build is `npm install && npm run build`, start is `npm run serve`.
5. Your site + API are now at `https://wild-inn.onrender.com` (or your custom domain).
   Point your DNS at Render and drop the AI Studio deploy.

Free tier cold-starts after ~15 min idle (first request takes ~30 s). The `starter`
plan ($7/mo) keeps it warm. Railway / Fly / a small VPS work identically —
`npm run build && npm run serve` + the same env vars.

## After deploying — one-time DB setup on the host's database

The Neon DB is shared, so this is already done. If you ever point at a fresh DB:

```
psql "$DATABASE_URL" -f db/schema.sql   # or paste into Neon SQL editor
npm run db:coupons                       # seed the 10 coupon codes
npm run db:packages                      # seed package prices from destinationsData.ts
```

## Editing prices

Prices now live in the Neon **`packages`** table and are edited from **/admin →
Experiences & prices**. Changes take effect on the next checkout immediately — no
redeploy. `server/pricing.json` (generated from `src/data/destinationsData.ts` at build)
is only the fallback used before the first edit / when the DB is unreachable.

To change the *starting* prices in code: edit `src/data/destinationsData.ts`, then
`npm run db:packages` (re-seeds only missing rows) or `node scripts/seed-packages.mjs --force`
(overwrites every row — discards admin edits).
