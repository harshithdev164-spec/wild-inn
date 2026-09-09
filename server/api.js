// The full /api surface as an Express app. Mounted by serve.js (prod) and by the
// Vite dev middleware (vite.config.ts) so `npm run dev` needs no second process.

import express from 'express';
import { getReels } from './reels.js';
import { quote, createOrder, verifyPayment, markOrder, httpError } from './payments.js';
import { listPackages as catalogPackages } from './catalog.js';
import {
  checkAdmin, listCoupons, upsertCoupon, setCouponActive, listOrders,
  listPackages as adminPackages, upsertPackage,
} from './admin.js';

const wrap = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((err) => sendErr(res, err));

function sendErr(res, err) {
  const status = err?.status || 500;
  if (status >= 500) console.error('[api]', err);
  res.status(status).json({ error: err?.code || 'server_error', detail: err?.extra });
}

/**
 * JSON body parser that works everywhere this app runs:
 *  - Vercel serverless already parses the body into req.body (object/string/Buffer)
 *    and drains the stream, so express.json() would see nothing.
 *  - Vite dev middleware / serve.js pass a raw stream with no req.body.
 */
function jsonBody(req, _res, next) {
  const m = (req.method || 'GET').toUpperCase();
  if (m === 'GET' || m === 'HEAD') return next();

  const b = req.body;
  if (b && typeof b === 'object' && !Buffer.isBuffer(b)) return next(); // already parsed (Vercel)
  if (typeof b === 'string' || Buffer.isBuffer(b)) {
    try { req.body = b.length ? JSON.parse(b.toString()) : {}; } catch { req.body = {}; }
    return next();
  }

  let raw = '';
  let tooBig = false;
  req.on('data', (c) => {
    raw += c;
    if (raw.length > 32768) { tooBig = true; req.destroy(); }
  });
  req.on('end', () => {
    if (tooBig) { req.body = {}; return next(); }
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    next();
  });
  req.on('error', () => { req.body = {}; next(); });
}

export function createApiApp() {
  const app = express();
  app.use(jsonBody);

  // --- Reels -------------------------------------------------------------
  app.get('/api/reels', wrap(async (_req, res) => {
    const reels = await getReels();
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ reels });
  }));

  // --- Catalogue (public) --------------------------------------------
  app.get('/api/packages', wrap(async (_req, res) => {
    const packages = await catalogPackages();
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
    res.json({ packages });
  }));

  // --- Checkout --------------------------------------------------------
  app.post('/api/checkout/quote', wrap(async (req, res) => {
    res.json(await quote(req.body || {}));
  }));

  app.post('/api/checkout/order', wrap(async (req, res) => {
    const b = req.body || {};
    if (!b.slug || !b.packageName) throw httpError(400, 'missing_fields');
    res.json(await createOrder(b));
  }));

  app.post('/api/checkout/verify', wrap(async (req, res) => {
    res.json(await verifyPayment(req.body || {}));
  }));

  app.post('/api/checkout/mark', wrap(async (req, res) => {
    res.json(await markOrder(req.body || {}));
  }));

  // --- Admin (x-admin-key) ------------------------------------------
  app.get('/api/admin/coupons', wrap(async (req, res) => {
    checkAdmin(req);
    res.json(await listCoupons());
  }));

  app.post('/api/admin/coupons', wrap(async (req, res) => {
    checkAdmin(req);
    res.json(await upsertCoupon(req.body || {}));
  }));

  app.post('/api/admin/coupons/:code/active', wrap(async (req, res) => {
    checkAdmin(req);
    res.json(await setCouponActive(req.params.code, (req.body || {}).active));
  }));

  app.get('/api/admin/orders', wrap(async (req, res) => {
    checkAdmin(req);
    res.json(await listOrders(req.query.limit));
  }));

  app.get('/api/admin/packages', wrap(async (req, res) => {
    checkAdmin(req);
    res.json(await adminPackages());
  }));

  app.post('/api/admin/packages', wrap(async (req, res) => {
    checkAdmin(req);
    res.json(await upsertPackage(req.body || {}));
  }));

  app.all('/api/*', (_req, res) => res.status(404).json({ error: 'not_found' }));
  return app;
}
