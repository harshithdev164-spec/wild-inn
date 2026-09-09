// Build step: derive the server-side pricing table from destinationsData.ts.
// Run with tsx (a devDependency):  npx tsx scripts/build-pricing.ts
// Output: server/pricing.json  — the ONLY amount source the payment API trusts.

import { writeFileSync } from 'node:fs';
import { DESTINATIONS } from '../src/data/destinationsData';

/** "₹40,000" -> 4000000 (paise) */
function toPaise(price: string): number {
  const rupees = Number(String(price).replace(/[^\d.]/g, ''));
  if (!Number.isFinite(rupees) || rupees <= 0) throw new Error(`bad price: ${price}`);
  return Math.round(rupees * 100);
}

const out: Record<
  string,
  { name: string; packages: Record<string, { price: number; unit: string; duration: string }> }
> = {};

for (const d of DESTINATIONS) {
  const packages: Record<string, { price: number; unit: string; duration: string }> = {};
  for (const p of d.packages) {
    packages[p.name] = { price: toPaise(p.price), unit: p.unit, duration: p.duration };
  }
  out[d.id] = { name: d.name, packages };
}

writeFileSync('server/pricing.json', JSON.stringify(out, null, 2) + '\n');
const count = Object.values(out).reduce((n, d) => n + Object.keys(d.packages).length, 0);
console.log(`[pricing] wrote server/pricing.json — ${Object.keys(out).length} destinations, ${count} packages`);
