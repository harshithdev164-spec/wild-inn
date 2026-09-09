// Vercel serverless entry for the whole API.
// Vercel routes every /api/* request to this catch-all function; `req.url` is the
// full original path (e.g. /api/checkout/quote), which the Express app matches.
import { createApiApp } from '../server/api.js';

export default createApiApp();
