// Seed the `packages` table from server/pricing.json (generated from destinationsData.ts).
//   node scripts/seed-packages.mjs           insert missing rows only (keeps admin edits)
//   node scripts/seed-packages.mjs --force   overwrite every row with the code values
//
// Run `npm run prebuild:pricing` first if you changed prices in destinationsData.ts.

import { readFile } from 'node:fs/promises';
import { config } from 'dotenv';

config({ path: '.env' });
config({ path: '.env.local', override: true });

if (!process.env.DATABASE_URL) {
  console.error('✗ DATABASE_URL is not set (check .env.local, or run `neon link`).');
  process.exit(1);
}

const force = process.argv.includes('--force');
const pricing = JSON.parse(await readFile('server/pricing.json', 'utf8'));

const { neon } = await import('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

let n = 0;
for (const [slug, dest] of Object.entries(pricing)) {
  let order = 0;
  for (const [name, p] of Object.entries(dest.packages)) {
    order += 10;
    if (force) {
      await sql`
        insert into packages (slug, name, destination, price, unit, duration, sort_order, active, updated_at)
        values (${slug}, ${name}, ${dest.name}, ${p.price}, ${p.unit}, ${p.duration}, ${order}, true, now())
        on conflict (slug, name) do update set
          destination = excluded.destination, price = excluded.price, unit = excluded.unit,
          duration = excluded.duration, updated_at = now()
      `;
    } else {
      await sql`
        insert into packages (slug, name, destination, price, unit, duration, sort_order)
        values (${slug}, ${name}, ${dest.name}, ${p.price}, ${p.unit}, ${p.duration}, ${order})
        on conflict (slug, name) do nothing
      `;
    }
    n++;
    console.log(`  ${force ? '↻' : '+'} ${slug} / ${name}  ₹${(p.price / 100).toLocaleString('en-IN')}`);
  }
}

const [{ c }] = await sql`select count(*)::int as c from packages`;
console.log(`✓ ${force ? 'Reset' : 'Ensured'} ${n} package(s) from server/pricing.json. Table has ${c} row(s).`);
