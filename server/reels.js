// Shared reels data-access layer.
// Used by the production Express server (server.js) and the Vite dev middleware (vite.config.ts).
//
// If DATABASE_URL is set, reels are read from Neon. Otherwise we fall back to db/sample-reels.json
// so the /reels page is testable before the database is wired up.

import sampleReels from '../db/sample-reels.json' with { type: 'json' };

let _sql = null;
let _warnedNoDb = false;

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!_sql) {
    // Lazy import so the dependency is only touched when a DB URL exists.
    // eslint-disable-next-line import/no-unresolved
    return import('@neondatabase/serverless').then(({ neon }) => {
      _sql = neon(url);
      return _sql;
    });
  }
  return Promise.resolve(_sql);
}

function normalize(row) {
  return {
    id: String(row.id),
    title: row.title ?? '',
    tour_slug: row.tour_slug ?? null,
    location: row.location ?? null,
    description: row.description ?? null,
    video_url: row.video_url,
    poster_url: row.poster_url ?? null,
    duration_sec: Number(row.duration_sec ?? 30),
    aspect_ratio: row.aspect_ratio ?? '9:16',
    sort_order: Number(row.sort_order ?? 0),
  };
}

async function fromSample() {
  if (!_warnedNoDb) {
    console.warn('[reels] DATABASE_URL not set — serving db/sample-reels.json');
    _warnedNoDb = true;
  }
  return sampleReels
    .filter((r) => r.published !== false)
    .map(normalize)
    .sort((a, b) => a.sort_order - b.sort_order);
}

/** Returns the published reels ordered for the feed. Never throws — falls back to []. */
export async function getReels() {
  try {
    const sqlOrPromise = getSql();
    if (!sqlOrPromise) return await fromSample();
    const sql = await sqlOrPromise;
    const rows = await sql`
      select id, title, tour_slug, location, description, video_url,
             poster_url, duration_sec, aspect_ratio, sort_order
      from reels
      where published = true
      order by sort_order asc, created_at desc
    `;
    return rows.map(normalize);
  } catch (err) {
    console.error('[reels] query failed:', err?.message || err);
    // If the DB is unreachable/misconfigured, still try the sample so the page renders.
    try {
      return await fromSample();
    } catch {
      return [];
    }
  }
}

/** Express-style handler for GET /api/reels. */
export async function reelsHandler(_req, res) {
  const reels = await getReels();
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ reels }));
}
