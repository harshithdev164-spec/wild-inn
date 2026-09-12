import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Check, AlertCircle, Minus, Plus, Loader2, Tag, ShieldCheck, Play } from 'lucide-react';
import { formatINR, type QuoteBreakdown } from '../lib/money';

/** A short clip of what that price tier's stay actually looks like. */
function stayVideoFor(priceLabel: string): { webm: string; mp4: string } | null {
  const rupees = Number(String(priceLabel).replace(/[^\d]/g, '')) || 0;
  if (rupees >= 35000 && rupees <= 45000) return { webm: '/video/stay-40k.webm', mp4: '/video/stay-40k.mp4' };
  if (rupees >= 8000 && rupees <= 13000) return { webm: '/video/stay-9to12k.webm', mp4: '/video/stay-9to12k.mp4' };
  return null;
}

interface Pkg {
  name: string;
  price: string;
  unit: string;
  duration: string;
}
interface CheckoutDialogProps {
  open: boolean;
  onClose: () => void;
  slug: string;
  destinationName: string;
  pkg: Pkg | null;
}

const RZP_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = RZP_SRC;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const todayStr = () => new Date().toISOString().slice(0, 10);

type Step = 'form' | 'processing' | 'success' | 'error';

export default function CheckoutDialog({ open, onClose, slug, destinationName, pkg }: CheckoutDialogProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '' });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [apiQuote, setApiQuote] = useState<QuoteBreakdown | null>(null);
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const reqId = useRef(0);

  // Instant local estimate from the package price, so the form never shows ₹0
  // even if the booking API is unreachable. The API response overrides this
  // (authoritative amount + coupon validation).
  const localQuote = useMemo<QuoteBreakdown>(() => {
    const unitPrice = paiseFromLabel(pkg?.price || '');
    const perHead = /per head/i.test(pkg?.unit || '');
    const perCouple = /per couple/i.test(pkg?.unit || '');
    const qty = perHead
      ? adults + children
      : perCouple
      ? Math.max(1, Math.ceil((adults + children) / 2))
      : 1;
    const base = unitPrice * qty;
    return {
      destination: destinationName,
      packageName: pkg?.name || '',
      unit: pkg?.unit || '',
      duration: pkg?.duration,
      perHead,
      perCouple,
      adults,
      children,
      qty,
      unitPrice,
      baseAmount: base,
      coupon: null,
      discountAmount: 0,
      amount: base,
      currency: 'INR',
    };
  }, [pkg, adults, children, destinationName]);

  // Prefer the API quote only when it matches the current selection.
  const quote =
    apiQuote && apiQuote.adults === adults && apiQuote.children === children ? apiQuote : localQuote;

  // Stay preview clips only exist for Kabini right now.
  const stayVideo = useMemo(() => (slug === 'kabini' ? stayVideoFor(pkg?.price || '') : null), [slug, pkg]);

  // Reset when (re)opened.
  useEffect(() => {
    if (!open) return;
    setForm({ name: '', email: '', phone: '', date: '' });
    setAdults(2);
    setChildren(0);
    setCoupon('');
    setAppliedCoupon('');
    setCouponError('');
    setApiQuote(null);
    setStep('form');
    setError('');
    setOrderRef('');
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, pkg?.name]);

  // Live quote whenever counts / applied coupon change.
  useEffect(() => {
    if (!open || !pkg) return;
    const id = ++reqId.current;
    fetch('/api/checkout/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, packageName: pkg.name, adults, children, coupon: appliedCoupon }),
    })
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (id !== reqId.current) return;
        if (ok) {
          setApiQuote(j);
          setCouponError('');
        } else if (appliedCoupon) {
          // Coupon rejected — drop it and fall back to the local price.
          setCouponError(couponMsg(j.error) || 'That coupon could not be applied.');
          setAppliedCoupon('');
        }
      })
      .catch(() => {
        if (id !== reqId.current) return;
        if (appliedCoupon) {
          setCouponError('Could not reach the booking service to check the coupon.');
          setAppliedCoupon('');
        }
      });
  }, [open, pkg, slug, adults, children, appliedCoupon]);

  if (!pkg) return null;

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    setCouponError('');
    if (!c) return;
    setAppliedCoupon(c);
  };
  const removeCoupon = () => {
    setAppliedCoupon('');
    setCoupon('');
    setCouponError('');
  };

  const canPay =
    !!form.name.trim() &&
    /.+@.+\..+/.test(form.email) &&
    form.phone.trim().length >= 7 &&
    !!form.date &&
    quote.amount > 0;

  const pay = async () => {
    if (!canPay) return;
    setStep('processing');
    setError('');
    try {
      const orderRes = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          packageName: pkg.name,
          adults,
          children,
          coupon: appliedCoupon,
          customer: form,
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(couponMsg(order.error) || 'Could not start the payment.');

      const markOrder = (status: 'failed' | 'abandoned') =>
        fetch('/api/checkout/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ razorpay_order_id: order.order_id, status }),
        }).catch(() => {});

      const ok = await loadRazorpay();
      if (!ok || !(window as any).Razorpay) throw new Error('Could not load the payment window. Check your connection.');

      const rzp = new (window as any).Razorpay({
        key: order.key_id,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Wild Inn',
        description: `${pkg.name} — ${destinationName}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { slug, package: pkg.name },
        theme: { color: '#0A0A0A' },
        modal: {
          ondismiss: () => {
            markOrder('abandoned');
            setStep('form');
          },
        },
        handler: async (resp: any) => {
          setStep('processing');
          try {
            const vr = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(resp),
            });
            const vj = await vr.json();
            if (!vr.ok || !vj.ok) throw new Error('We could not confirm the payment. If money was deducted, contact us with your reference.');
            setOrderRef(order.order_id);
            setStep('success');
          } catch (e) {
            setError((e as Error).message);
            setStep('error');
          }
        },
      });
      rzp.on('payment.failed', (r: any) => {
        markOrder('failed');
        setError(r?.error?.description || 'The payment failed. No amount was charged.');
        setStep('error');
      });
      rzp.open();
      setStep('form');
    } catch (e) {
      setError((e as Error).message);
      setStep('error');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto px-4 py-[6vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={step === 'processing' ? undefined : onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Book ${pkg.name}`}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] shadow-2xl"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/40">{destinationName}</p>
                <h3 className="mt-0.5 font-sans text-lg text-white">{pkg.name}</h3>
                <p className="text-[11px] text-white/45">{pkg.duration} · {pkg.unit}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-white/40 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            {step === 'success' ? (
              <div className="px-5 py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="mt-4 font-sans text-xl text-white">Payment received</h4>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/60">
                  Thank you. Your booking for <span className="text-white/90">{pkg.name}</span> is confirmed — our team will
                  reach out on <span className="text-white/90">{form.phone}</span> to finalise the details.
                </p>
                <p className="mt-3 font-mono text-[11px] text-white/40">Ref: {orderRef}</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-black"
                >
                  Done
                </button>
              </div>
            ) : step === 'error' ? (
              <div className="px-5 py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h4 className="mt-4 font-sans text-lg text-white">Something went wrong</h4>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-white/60">{error}</p>
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="mt-6 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-black"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="max-h-[64vh] overflow-y-auto px-5 py-5">
                {stayVideo && <StayPreview key={stayVideo.webm} webm={stayVideo.webm} mp4={stayVideo.mp4} />}

                {/* Customer fields */}
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Your name" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" />
                    <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91…" />
                  </div>
                  <Field label="Preferred date" type="date" value={form.date} min={todayStr()} onChange={(v) => setForm({ ...form, date: v })} />
                </div>

                {/* Travellers */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Counter label="Adults" value={adults} min={1} onChange={setAdults} />
                  <Counter label="Children" value={children} min={0} onChange={setChildren} />
                </div>

                {/* Coupon */}
                <div className="mt-4">
                  <label className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-wider text-white/45">Coupon code</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
                      <span className="flex items-center gap-2 text-xs text-emerald-300">
                        <Tag className="h-3.5 w-3.5" />
                        {appliedCoupon} applied{quote.coupon ? ` — ${quote.coupon.percent}% off` : ''}
                      </span>
                      <button type="button" onClick={removeCoupon} className="text-emerald-300/70 hover:text-emerald-200">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                        placeholder="e.g. WILDND@10"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-4 text-xs font-medium text-white/80 hover:bg-white/10"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="mt-1.5 text-[11px] text-rose-400">{couponError}</p>}
                </div>

                {/* Summary */}
                <div className="mt-5 space-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
                  <Row
                    label={`${formatINR(quote.unitPrice)}${quote.qty > 1 ? ` × ${quote.qty}${quote.perCouple ? ' couples' : ''}` : ''}`}
                    value={formatINR(quote.baseAmount)}
                    muted
                  />
                  {quote.coupon && quote.discountAmount > 0 && (
                    <Row
                      label={`Coupon ${quote.coupon.code} (−${quote.coupon.percent}%)`}
                      value={`− ${formatINR(quote.discountAmount)}`}
                      accent
                    />
                  )}
                  <div className="my-1 h-px bg-white/10" />
                  <Row label="Total payable" value={formatINR(quote.amount)} bold />
                </div>

                <button
                  type="button"
                  onClick={pay}
                  disabled={!canPay || step === 'processing'}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition-opacity disabled:opacity-40"
                >
                  {step === 'processing' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                    </>
                  ) : (
                    <>Pay {formatINR(quote.amount)} now</>
                  )}
                </button>
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-white/35">
                  <ShieldCheck className="h-3 w-3" /> Secured by Razorpay
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- small presentational helpers ---------- */

function StayPreview({ webm, mp4 }: { key?: string; webm: string; mp4: string }) {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={paused ? 'Play preview' : 'Pause preview'}
      className="group relative mx-auto mb-4 block aspect-[9/16] h-72 overflow-hidden rounded-xl bg-black sm:h-80"
    >
      <video
        ref={ref}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <span className="absolute bottom-2.5 left-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/85 backdrop-blur-xs">
        A glimpse of your stay
      </span>
      {paused && (
        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50">
            <Play className="h-4 w-4 translate-x-0.5 text-white" fill="currentColor" />
          </span>
        </span>
      )}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  min?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-mono font-semibold uppercase tracking-wider text-white/45">{label}</span>
      <input
        type={type}
        value={value}
        min={min}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none [color-scheme:dark]"
      />
    </label>
  );
}

function Counter({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <span className="text-xs text-white/80">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-white disabled:opacity-20"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center font-mono text-sm text-white">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-white"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, bold, muted, accent }: { label: string; value: string; bold?: boolean; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`${muted ? 'text-white/50' : accent ? 'text-emerald-400' : 'text-white/70'} text-xs`}>{label}</span>
      <span className={`${bold ? 'text-base font-semibold text-white' : accent ? 'text-emerald-400' : 'text-white/80'} text-sm`}>{value}</span>
    </div>
  );
}

function paiseFromLabel(price: string): number {
  return Math.round(Number(String(price).replace(/[^\d.]/g, '')) * 100) || 0;
}

function couponMsg(code: string): string {
  switch (code) {
    case 'coupon_invalid':
      return 'That coupon code is not valid.';
    case 'coupon_exhausted':
      return 'That coupon has reached its usage limit.';
    case 'package_not_found':
      return 'This package is not available for online booking.';
    case 'payments_not_configured':
      return 'Online payments are not available yet. Please contact us to book.';
    default:
      return '';
  }
}
