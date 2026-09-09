// Sync the reels table in Neon from a JSON file.
//
//   node scripts/seed-reels.mjs [file]            upsert every row (default file: db/reels.json)
//   node scripts/seed-reels.mjs [file] --prune    also delete DB rows whose id isn't in the file
//
// Each row needs a stable `id` (a short slug, e.g. "kabini-dawn") so re-running is idempotent.
// If a row's video_url / poster_url is a site-relative path ("/reels/x.mp4"), the matching file
// under public/ must exist. When poster_url is missing for a local video, a WebP poster is
// generated at public/reels/<id>.webp (via the bundled ffmpeg-static).
//
// Reads DATABASE_URL from .env.local (falling back to .env).

import { readFile, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { config } from 'dotenv';

const pexecFile = promisify(execFile);

config({ path: '.env' });
config({ path: '.env.local', override: true });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('✗ DATABASE_URL is not set (check .env.local, or run `neon link`).');
  process.exit(1);
}

const args = process.argv.slice(2);
const prune = args.includes('--prune');
const file = args.find((a) => !a.startsWith('--')) || 'db/reels.json';

let rows;
try {
  rows = JSON.parse(await readFile(file, 'utf8'));
} catch (e) {
  console.error(`✗ Could not read ${file}: ${e.message}`);
  process.exit(1);
}
if (!Array.isArray(rows)) {
  console.error(`✗ ${file} must be a JSON array of reel objects.`);
  process.exit(1);
}

// ---- validate -------------------------------------------------------------
const errors = [];
const seen = new Set();
for (const [i, r] of rows.entries()) {
  const where = `row ${i + 1}${r.title ? ` ("${r.title}")` : ''}`;
  if (!r.id) errors.push(`${where}: missing "id" (use a short slug like "kabini-dawn")`);
  else if (seen.has(r.id)) errors.push(`${where}: duplicate id "${r.id}"`);
  else seen.add(r.id);
  if (!r.title) errors.push(`${where}: missing "title"`);
  if (!r.video_url) errors.push(`${where}: missing "video_url"`);
  for (const key of ['video_url', 'poster_url']) {
    const v = r[key];
    if (typeof v === 'string' && v.startsWith('/') && !existsSync(`public${v}`)) {
      errors.push(`${where}: ${key} "${v}" not found at public${v}`);
    }
  }
}
if (errors.length) {
  console.error('✗ Validation failed:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}

// ---- best-effort poster generation (WebP, via bundled ffmpeg-static) ----
let ffmpeg = null;
try {
  const { createRequire } = await import('node:module');
  ffmpeg = createRequire(import.meta.url)('ffmpeg-static');
} catch {
  /* no ffmpeg-static — skip */
}

for (const r of rows) {
  const local = typeof r.video_url === 'string' && r.video_url.startsWith('/reels/');
  if (r.poster_url || !local) continue;
  const out = `public/reels/${r.id}.webp`;
  if (existsSync(out)) {
    r.poster_url = `/reels/${r.id}.webp`;
    continue;
  }
  if (!ffmpeg) continue;
  try {
    await pexecFile(ffmpeg, ['-y', '-ss', '1', '-i', `public${r.video_url}`, '-frames:v', '1',
      '-c:v', 'libwebp', '-quality', '80', out]);
    r.poster_url = `/reels/${r.id}.webp`;
    console.log(`  poster generated ${out}`);
  } catch {
    console.warn(`  ! could not generate poster for ${r.id}`);
  }
}

// ---- write --------------------------------------------------------------
const { neon } = await import('@neondatabase/serverless');
const sql = neon(url);

for (const r of rows) {
  await sql`
    insert into reels (id, title, tour_slug, location, description, video_url,
                       poster_url, duration_sec, aspect_ratio, sort_order, published)
    values (
      ${r.id}, ${r.title}, ${r.tour_slug ?? null}, ${r.location ?? null}, ${r.description ?? null},
      ${r.video_url}, ${r.poster_url ?? null}, ${r.duration_sec ?? 30},
      ${r.aspect_ratio ?? '9:16'}, ${r.sort_order ?? 0}, ${r.published ?? true}
    )
    on conflict (id) do update set
      title = excluded.title, tour_slug = excluded.tour_slug, location = excluded.location,
      description = excluded.description, video_url = excluded.video_url,
      poster_url = excluded.poster_url, duration_sec = excluded.duration_sec,
      aspect_ratio = excluded.aspect_ratio, sort_order = excluded.sort_order,
      published = excluded.published
  `;
  console.log(`  ↑ ${r.id}  ${r.title}`);
}

if (prune) {
  const ids = rows.map((r) => r.id);
  const deleted = await sql`delete from reels where not (id = any(${ids})) returning id`;
  for (const d of deleted) console.log(`  ✗ pruned ${d.id}`);
}

const count = await sql`select count(*)::int as n from reels`;
console.log(`✓ Synced ${rows.length} reel(s) from ${file}. Table now has ${count[0].n} row(s).`);
