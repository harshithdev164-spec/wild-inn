// Quick Neon connectivity + schema check.
//   node scripts/check-db.mjs
// Reads DATABASE_URL from .env.local (falling back to .env).

import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local', override: true });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('✗ DATABASE_URL is not set. Add it to .env.local, then re-run.');
  process.exit(1);
}

const { neon } = await import('@neondatabase/serverless');
const sql = neon(url);

try {
  const [{ now }] = await sql`select now()`;
  console.log(`✓ Connected to Neon — server time ${now}`);
} catch (e) {
  console.error(`✗ Could not connect: ${e.message}`);
  process.exit(1);
}

try {
  const [{ n }] = await sql`select count(*)::int as n from reels`;
  console.log(`✓ "reels" table exists — ${n} row(s)`);
  if (n > 0) {
    const rows = await sql`
      select title, tour_slug, published, sort_order
      from reels order by sort_order asc, created_at desc limit 10`;
    for (const r of rows) {
      console.log(
        `   • [${r.sort_order}] ${r.title}` +
          `${r.tour_slug ? ` → ${r.tour_slug}` : ''}` +
          `${r.published ? '' : '  (unpublished)'}`
      );
    }
  } else {
    console.log('   (no reels yet — insert some, see db/README.md)');
  }
} catch (e) {
  console.error(`✗ "reels" table not found: ${e.message}`);
  console.error('  Run db/schema.sql in the Neon SQL editor first.');
  process.exit(1);
}
