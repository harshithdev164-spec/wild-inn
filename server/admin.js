// Admin API — coupons + orders. Gated by a single passcode (ADMIN_PASSCODE env var),
// sent by the client as the `x-admin-key` header.

import { timingSafeEqual } from 'node:crypto';
import { db, hasDb } from './db.js';
import { httpError } from './payments.js';
import { listPackages as catalogList } from './catalog.js';

export function checkAdmin(req) {
  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) throw httpError(503, 'admin_not_configured');
  const given = req.get?.('x-admin-key') || req.headers?.['x-admin-key'] || '';
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw httpError(401, 'unauthorized');
}

export async function listCoupons() {
  if (!hasDb()) return { coupons: [] };
  const coupons = await db()`
    select c.code, c.percent, c.owner, c.active, c.max_uses, c.uses, c.created_at,
           coalesce(o.paid_count, 0)::int      as paid_orders,
           coalesce(o.discount_total, 0)::int  as discount_total
    from coupons c
    left join (
      select coupon_code,
             count(*) filter (where status = 'paid')                       as paid_count,
             sum(discount_amount) filter (where status = 'paid')           as discount_total
      from orders group by coupon_code
    ) o on o.coupon_code = c.code
    order by c.owner nulls last, c.code
  `;
  return { coupons };
}

export async function upsertCoupon(body) {
  if (!hasDb()) throw httpError(503, 'db_not_configured');
  const code = String(body.code || '').trim().toUpperCase();
  const percent = Math.trunc(Number(body.percent));
  if (!code) throw httpError(400, 'code_required');
  if (!(percent >= 1 && percent <= 90)) throw httpError(400, 'percent_out_of_range');
  const owner = body.owner ? String(body.owner) : null;
  const active = body.active !== false;
  const maxUses = body.max_uses === '' || body.max_uses == null ? null : Math.trunc(Number(body.max_uses));

  await db()`
    insert into coupons (code, percent, owner, active, max_uses)
    values (${code}, ${percent}, ${owner}, ${active}, ${maxUses})
    on conflict (code) do update set
      percent = excluded.percent, owner = excluded.owner,
      active = excluded.active, max_uses = excluded.max_uses
  `;
  return listCoupons();
}

export async function setCouponActive(code, active) {
  if (!hasDb()) throw httpError(503, 'db_not_configured');
  await db()`update coupons set active = ${!!active} where code = ${String(code).toUpperCase()}`;
  return listCoupons();
}

export async function listOrders(limit = 200) {
  if (!hasDb()) return { orders: [], summary: emptySummary() };
  const orders = await db()`
    select id, razorpay_order_id, razorpay_payment_id, slug, package_name, unit,
           adults, children, base_amount, coupon_code, discount_amount, amount,
           currency, customer_name, customer_email, customer_phone, travel_date,
           status, created_at, paid_at
    from orders
    order by created_at desc
    limit ${clampLimit(limit)}
  `;
  const [s] = await db()`
    select
      count(*) filter (where status = 'paid')::int             as paid_count,
      count(*)::int                                             as total_count,
      coalesce(sum(amount) filter (where status = 'paid'), 0)::int      as revenue,
      coalesce(sum(discount_amount) filter (where status = 'paid'), 0)::int as discount_given
    from orders
  `;
  return { orders, summary: s || emptySummary() };
}

function emptySummary() {
  return { paid_count: 0, total_count: 0, revenue: 0, discount_given: 0 };
}
function clampLimit(n) {
  const v = Math.trunc(Number(n) || 200);
  return Math.min(1000, Math.max(1, v));
}

/* --------------------------- packages / prices --------------------------- */

export async function listPackages() {
  return { packages: await catalogList({ includeInactive: true }) };
}

export async function upsertPackage(body) {
  if (!hasDb()) throw httpError(503, 'db_not_configured');
  const slug = String(body.slug || '').trim();
  const name = String(body.name || '').trim();
  const price = Math.trunc(Number(body.price));
  if (!slug || !name) throw httpError(400, 'slug_and_name_required');
  if (!(price >= 100 && price <= 100000000)) throw httpError(400, 'price_out_of_range'); // ₹1 … ₹10,00,000
  const unit = body.unit ? String(body.unit) : 'Per Head';
  const duration = body.duration ? String(body.duration) : '2 Days • 1 Night';
  const destination = body.destination ? String(body.destination) : null;
  const active = body.active !== false;
  const sortOrder = Number.isFinite(Number(body.sort_order)) ? Math.trunc(Number(body.sort_order)) : 0;

  await db()`
    insert into packages (slug, name, destination, price, unit, duration, sort_order, active, updated_at)
    values (${slug}, ${name}, ${destination}, ${price}, ${unit}, ${duration}, ${sortOrder}, ${active}, now())
    on conflict (slug, name) do update set
      destination = coalesce(excluded.destination, packages.destination),
      price = excluded.price, unit = excluded.unit, duration = excluded.duration,
      sort_order = excluded.sort_order, active = excluded.active, updated_at = now()
  `;
  return listPackages();
}
