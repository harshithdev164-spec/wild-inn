// Build step: publish the reel feed as a static file the SPA can read without a server.
// Runs before `vite build`. Source of truth is db/reels.json (falls back to db/sample-reels.json).
// Output: public/reels-data.json  ->  served at /reels-data.json

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const src = existsSync('db/reels.json') ? 'db/reels.json' : 'db/sample-reels.json';

let rows;
try {
  rows = JSON.parse(await readFile(src, 'utf8'));
} catch (e) {
  console.error(`[reels-data] could not read ${src}: ${e.message}`);
  process.exit(1);
}

const reels = rows
  .filter((r) => r.published !== false)
  .map((r) => ({
    id: String(r.id),
    title: r.title ?? '',
    tour_slug: r.tour_slug ?? null,
    location: r.location ?? null,
    description: r.description ?? null,
    video_url: r.video_url,
    poster_url: r.poster_url ?? null,
    duration_sec: Number(r.duration_sec ?? 30),
    aspect_ratio: r.aspect_ratio ?? '9:16',
    sort_order: Number(r.sort_order ?? 0),
  }))
  .sort((a, b) => a.sort_order - b.sort_order);

await writeFile('public/reels-data.json', JSON.stringify({ reels }, null, 2) + '\n');
console.log(`[reels-data] wrote public/reels-data.json (${reels.length} reel(s)) from ${src}`);
