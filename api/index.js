// Vercel serverless entry for the whole API.
// vercel.json rewrites every /api/* request here; we normalise req.url so the
// Express routes (all prefixed /api/...) match regardless of how Vercel rewrites the path.
import { createApiApp } from '../server/api.js';

const app = createApiApp();

export default function handler(req, res) {
  if (typeof req.url === 'string' && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? '' : '/') + req.url;
  }
  return app(req, res);
}
