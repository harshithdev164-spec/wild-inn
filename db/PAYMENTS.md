# Payments, coupons & admin

Package checkout uses **Razorpay**. Every package on `/experiences/:slug` has a
**Book & Pay** button that opens a form → shows an itemised total → opens Razorpay.

## How the amount is decided

The client **never** sends a price. On `POST /api/checkout/order` the server:

1. Looks up the package price in the `packages` table (editable in `/admin`; falls back to
   `server/pricing.json`, generated from `src/data/destinationsData.ts` by `scripts/build-pricing.ts`).
2. Prices purely by age, not "adult" vs "child": travellers **10 years and over** pay full
   price, travellers **under 10** pay 50%. `Per Head` packages charge per head at those two
   rates; `Per Couple` packages charge a flat rate per 2 travellers (`ceil(travellers / 2)`) —
   the age discount doesn't apply to a couple's bucket price. Anything else is a flat price.
3. Applies a coupon if valid: `discount = round(base × percent / 100)`.
4. Creates a Razorpay order for the final amount and writes a `created` row in `orders`
   (adults, children, children_under10, check_in_date, check_out_date, …).

`POST /api/checkout/verify` checks the Razorpay signature (HMAC-SHA256), flips the order to
`paid`, and bumps `coupons.uses`.

## Environment (`.env.local`, gitignored)

```
RAZORPAY_KEY_ID="rzp_live_xxx"
RAZORPAY_KEY_SECRET="xxx"          # server-side only
ADMIN_PASSCODE="something-private" # gate for /admin
DATABASE_URL="postgres://…neon…"   # coupons + orders live here
```

## Coupons

Source of truth: [`db/coupons.json`](./coupons.json). Format `CODE@NN` where `NN` is the
percent (it's literally part of the code the customer types). The `owner` field is who the
code belongs to, shown in the admin panel.

```
npm run db:coupons          # upsert db/coupons.json into Neon (keeps existing `uses` counts)
```

You can also add / edit / disable coupons live from the admin panel.

## Admin panel — `/admin`

Not linked anywhere, disallowed in `robots.txt`. Enter `ADMIN_PASSCODE` to sign in
(stored in the browser afterwards). Shows:

- **Summary** — revenue (paid), paid orders, all orders, total discount given
- **Coupons** — code, %, owner, uses, paid orders per code, ₹ discount given, max-uses, active toggle, and an add/update form
- **Experiences & prices** — the price charged for every package, editable inline (₹). Stored in the Neon `packages` table; changes apply to the next checkout with no redeploy. See [BACKEND.md](../BACKEND.md#editing-prices).
- **Orders** — every checkout: date, customer, package, travellers, base, coupon, discount, amount, status:
  - `pending` (grey) — order created, customer hasn't finished paying yet
  - `paid` (green) — payment verified
  - `failed` (red) — Razorpay reported the payment failed
  - `abandoned` (amber) — customer closed the payment window without paying

  `failed` / `abandoned` are reported by the browser (`POST /api/checkout/mark`). A row can
  get stuck at `pending` only if the customer's browser closed before either event fired;
  Razorpay webhooks would close that gap and are the eventual upgrade.

## Production

`/api/checkout/*` and `/api/admin/*` **need a Node server** — they cannot run on the static
build. `serve.js` (Express) serves `dist/` + the whole API. Deploy it to any Node host and
point the site there:

- **Render** (free tier works): new Web Service → build `npm install && npm run build` →
  start `npm run serve` → add the env vars above. It serves both the site and the API.
- Or Railway / Fly / a small VPS — same `npm run build && npm run serve`.

Set the same env vars on the host. Razorpay keys must be **live** keys for real payments
(use `rzp_test_*` keys on a staging deploy).
