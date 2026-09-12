// Razorpay checkout + coupon logic. All amounts in paise (INR).
// The client never sends an amount — it is always computed here from the package catalogue
// (Neon `packages` table, editable in /admin; server/pricing.json is the fallback).

import { createHmac, timingSafeEqual } from 'node:crypto';
import { db, hasDb } from './db.js';
import { getPackage } from './catalog.js';

function keys() {
  const id = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw httpError(503, 'payments_not_configured');
  return { id, secret };
}

export function httpError(status, code, extra) {
  const e = new Error(code);
  e.status = status;
  e.code = code;
  if (extra) e.extra = extra;
  return e;
}

const clampInt = (v, lo, hi) => Math.min(hi, Math.max(lo, Math.trunc(Number(v) || 0)));

/** Look up an active coupon; returns { code, percent } or null. Throws 422 if the code is bad. */
async function resolveCoupon(rawCode) {
  const code = String(rawCode || '').trim().toUpperCase();
  if (!code) return null;
  if (!hasDb()) throw httpError(422, 'coupon_invalid');
  const rows = await db()`
    select code, percent, active, max_uses, uses from coupons where code = ${code} limit 1
  `;
  const c = rows[0];
  if (!c || !c.active) throw httpError(422, 'coupon_invalid');
  if (c.max_uses != null && c.uses >= c.max_uses) throw httpError(422, 'coupon_exhausted');
  return { code: c.code, percent: c.percent };
}

/**
 * Compute a price quote. `couponCode` optional.
 * Pricing is purely by age: 10 years and above pays full price ("adults"),
 * under 10 pays 50% ("childrenUnder10"). There is no separate "child 10+" bucket.
 */
export async function quote({ slug, packageName, adults, childrenUnder10, coupon }) {
  const pkg = await getPackage(slug, packageName);
  if (!pkg) throw httpError(404, 'package_not_found');

  const a = clampInt(adults, 1, 40);
  const cu = clampInt(childrenUnder10, 0, 40);
  const perHead = /per head/i.test(pkg.unit || '');
  const perCouple = /per couple/i.test(pkg.unit || '');

  const fullPriceCount = a; // 10 years and above
  const halfPriceCount = cu; // under 10
  const halfPrice = Math.round(pkg.price / 2);

  let qty;
  let base;
  if (perHead) {
    // One full-price unit per person 10+, one half-price unit per person under 10.
    qty = fullPriceCount + halfPriceCount;
    base = pkg.price * fullPriceCount + halfPrice * halfPriceCount;
  } else if (perCouple) {
    // Couple packages are a flat per-2-travellers rate; the age discount doesn't apply to a bucket price.
    qty = Math.max(1, Math.ceil((fullPriceCount + halfPriceCount) / 2));
    base = pkg.price * qty;
  } else {
    qty = 1;
    base = pkg.price;
  }

  const c = await resolveCoupon(coupon);
  const discount = c ? Math.round((base * c.percent) / 100) : 0;
  const amount = Math.max(100, base - discount); // Razorpay minimum ₹1

  return {
    slug: String(slug),
    destination: pkg.destination,
    packageName: String(packageName),
    unit: pkg.unit,
    duration: pkg.duration,
    perHead,
    perCouple,
    adults: a,
    childrenUnder10: cu,
    children: cu,
    qty,
    unitPrice: pkg.price,
    halfPrice,
    fullPriceCount,
    halfPriceCount,
    baseAmount: base,
    coupon: c,
    discountAmount: discount,
    amount,
    currency: 'INR',
  };
}

async function razorpay(path, method, body) {
  const { id, secret } = keys();
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method,
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[razorpay]', res.status, json?.error?.description || json);
    throw httpError(502, 'razorpay_error', json?.error?.description);
  }
  return json;
}

/** Create a Razorpay order and persist a pending row. */
export async function createOrder(input) {
  const q = await quote(input);
  const customer = input.customer || {};
  const receipt = `wi_${Date.now().toString(36)}`;

  const order = await razorpay('/orders', 'POST', {
    amount: q.amount,
    currency: q.currency,
    receipt,
    notes: {
      slug: q.slug,
      package: q.packageName,
      travellers: String(q.qty),
      coupon: q.coupon?.code || '',
    },
  });

  if (hasDb()) {
    await db()`
      insert into orders (
        razorpay_order_id, slug, package_name, unit, adults, children, children_under10,
        base_amount, coupon_code, discount_amount, amount, currency,
        customer_name, customer_email, customer_phone, check_in_date, check_out_date, status
      ) values (
        ${order.id}, ${q.slug}, ${q.packageName}, ${q.unit}, ${q.adults}, ${q.children}, ${q.childrenUnder10},
        ${q.baseAmount}, ${q.coupon?.code ?? null}, ${q.discountAmount}, ${q.amount}, ${q.currency},
        ${customer.name ?? null}, ${customer.email ?? null}, ${customer.phone ?? null},
        ${customer.checkIn || null}, ${customer.checkOut || null}, 'created'
      )
      on conflict (razorpay_order_id) do nothing
    `;
  }

  return {
    key_id: keys().id,
    order_id: order.id,
    amount: q.amount,
    currency: q.currency,
    breakdown: {
      destination: q.destination,
      packageName: q.packageName,
      unit: q.unit,
      adults: q.adults,
      childrenUnder10: q.childrenUnder10,
      children: q.children,
      qty: q.qty,
      unitPrice: q.unitPrice,
      baseAmount: q.baseAmount,
      coupon: q.coupon,
      discountAmount: q.discountAmount,
      amount: q.amount,
    },
    customer,
  };
}

/** Mark a still-pending order as failed/abandoned (client-reported). Never touches a paid order. */
export async function markOrder({ razorpay_order_id, status }) {
  const allowed = new Set(['failed', 'abandoned']);
  if (!razorpay_order_id || !allowed.has(status)) throw httpError(400, 'bad_request');
  if (hasDb()) {
    await db()`
      update orders set status = ${status}
       where razorpay_order_id = ${razorpay_order_id} and status = 'created'
    `;
  }
  return { ok: true };
}

/** Verify the Razorpay signature, mark the order paid, bump coupon usage. */
export async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw httpError(400, 'missing_fields');
  }
  const { secret } = keys();
  const expected = createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    if (hasDb()) {
      await db()`update orders set status = 'failed' where razorpay_order_id = ${razorpay_order_id} and status = 'created'`;
    }
    throw httpError(400, 'signature_mismatch');
  }

  if (hasDb()) {
    const rows = await db()`
      update orders
         set status = 'paid', razorpay_payment_id = ${razorpay_payment_id}, paid_at = now()
       where razorpay_order_id = ${razorpay_order_id} and status <> 'paid'
      returning coupon_code
    `;
    const couponCode = rows[0]?.coupon_code;
    if (couponCode) {
      await db()`update coupons set uses = uses + 1 where code = ${couponCode}`;
    }
  }
  return { ok: true };
}
