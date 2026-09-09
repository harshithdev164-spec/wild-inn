// Production server: serves the built SPA (dist/) and the full /api surface.
// Run with:  npm run build && npm run serve
// Requires a Node runtime on the host (not pure static hosting).
// Named serve.js (not server.js) so `npm run clean` / the AI Studio build don't remove it.

import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local', override: true }); // local prod-mode testing; no-op when the host injects real env vars

import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createApiApp } from './server/api.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(createApiApp());

app.use(express.static(DIST, { index: false, maxAge: '1h' }));

// SPA fallback — every non-API route returns index.html.
app.get('*', (_req, res) => {
  res.sendFile(join(DIST, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Wild Inn server listening on :${PORT}`);
});
