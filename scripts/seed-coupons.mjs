// Upsert coupons from db/coupons.json into Neon. Safe to re-run.
//   node scripts/seed-coupons.mjs
// Preserves each coupon's `uses` count on update.

import { readFile } from 'node:fs/promises';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local', override: true });

if (!process.env.DATABASE_URL) {
  console.error('✗ DATABASE_URL is not set (check .env.local, or run `neon link`).');
  process.exit(1);
}

const rows = JSON.parse(await readFile('db/coupons.json', 'utf8'));
const { neon } = await import('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

for (const c of rows) {
  const code = String(c.code).trim().toUpperCase();
  await sql`
    insert into coupons (code, percent, owner, active, max_uses)
    values (${code}, ${c.percent}, ${c.owner ?? null}, ${c.active ?? true}, ${c.max_uses ?? null})
    on conflict (code) do update set
      percent  = excluded.percent,
      owner    = excluded.owner,
      active   = excluded.active,
      max_uses = excluded.max_uses
  `;
  console.log(`  ↑ ${code}  ${c.percent}%  ${c.owner ?? ''}`);
}

const [{ n }] = await sql`select count(*)::int as n from coupons`;
console.log(`✓ Synced ${rows.length} coupon(s). Table has ${n} row(s).`);
