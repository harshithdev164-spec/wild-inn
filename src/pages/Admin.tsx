import { useCallback, useEffect, useState } from 'react';
import { Loader2, LogOut, Plus, RefreshCw } from 'lucide-react';
import { formatINR } from '../lib/money';

const KEY_STORE = 'wildinn_admin_key';

const STATUS_LABEL: Record<string, string> = {
  created: 'pending',
  paid: 'paid',
  failed: 'failed',
  abandoned: 'abandoned',
};

type Coupon = {
  code: string;
  percent: number;
  owner: string | null;
  active: boolean;
  max_uses: number | null;
  uses: number;
  paid_orders: number;
  discount_total: number;
};
type Order = {
  id: string;
  razorpay_order_id: string;
  slug: string;
  package_name: string;
  adults: number;
  children: number;
  children_under10: number;
  base_amount: number;
  coupon_code: string | null;
  discount_amount: number;
  amount: number;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  status: string;
  created_at: string;
};
type Summary = { paid_count: number; total_count: number; revenue: number; discount_given: number };
type Package = {
  slug: string;
  name: string;
  destination: string | null;
  price: number; // paise
  unit: string;
  duration: string;
  sort_order: number;
  active: boolean;
  source?: 'db' | 'file';
};

export default function Admin() {
  const [key, setKey] = useState<string>(() => {
    try {
      return localStorage.getItem(KEY_STORE) || '';
    } catch {
      return '';
    }
  });
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [summary, setSummary] = useState<Summary>({ paid_count: 0, total_count: 0, revenue: 0, discount_given: 0 });
  const [newCoupon, setNewCoupon] = useState({ code: '', percent: '10', owner: '', max_uses: '' });
  const [priceEdits, setPriceEdits] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState('');

  // Every admin request takes the key explicitly so there is no stale-closure race.
  const apiWith = async (k: string, path: string, init?: RequestInit) => {
    const res = await fetch(`/api/admin${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', 'x-admin-key': k, ...(init?.headers || {}) },
    });
    if (res.status === 401) throw new Error('unauthorized');
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(j.error || 'request_failed');
    return j;
  };
  const api = (path: string, init?: RequestInit) => apiWith(key, path, init);

  const load = useCallback(async (k: string, opts: { fromLogin?: boolean } = {}) => {
    setLoading(true);
    try {
      const [c, o, p] = await Promise.all([
        apiWith(k, '/coupons'),
        apiWith(k, '/orders?limit=300'),
        apiWith(k, '/packages'),
      ]);
      setCoupons(c.coupons || []);
      setOrders(o.orders || []);
      setPackages(p.packages || []);
      setPriceEdits({});
      setSummary(o.summary || { paid_count: 0, total_count: 0, revenue: 0, discount_given: 0 });
      setKey(k);
      setAuthed(true);
      setAuthError('');
      try {
        localStorage.setItem(KEY_STORE, k);
      } catch {}
    } catch (e) {
      const unauthorized = (e as Error).message === 'unauthorized';
      if (unauthorized) {
        setAuthed(false);
        setKey('');
        try {
          localStorage.removeItem(KEY_STORE);
        } catch {}
        // Only complain if the user just typed a passcode; a stale stored key just falls back to the form.
        if (opts.fromLogin) setAuthError('That passcode is not valid.');
      } else if (opts.fromLogin) {
        setAuthError('Could not reach the server. Check that the API is running, then try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem(KEY_STORE) || '';
      } catch {
        return '';
      }
    })();
    if (stored) load(stored);
  }, [load]);

  const signIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setAuthError('');
    const k = passInput.trim();
    if (!k) return;
    load(k, { fromLogin: true });
  };

  const signOut = () => {
    try {
      localStorage.removeItem(KEY_STORE);
    } catch {}
    setKey('');
    setAuthed(false);
    setPassInput('');
  };

  const toggleCoupon = async (c: Coupon) => {
    const j = await api(`/coupons/${encodeURIComponent(c.code)}/active`, {
      method: 'POST',
      body: JSON.stringify({ active: !c.active }),
    });
    setCoupons(j.coupons || []);
  };

  const addCoupon = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const j = await api('/coupons', {
      method: 'POST',
      body: JSON.stringify({
        code: newCoupon.code,
        percent: Number(newCoupon.percent),
        owner: newCoupon.owner || null,
        max_uses: newCoupon.max_uses === '' ? null : Number(newCoupon.max_uses),
        active: true,
      }),
    });
    setCoupons(j.coupons || []);
    setNewCoupon({ code: '', percent: '10', owner: '', max_uses: '' });
  };

  const pkgKey = (p: Package) => `${p.slug}|${p.name}`;

  const savePackage = async (p: Package, patch: Partial<Package>) => {
    const kk = pkgKey(p);
    setSavingKey(kk);
    try {
      const j = await api('/packages', {
        method: 'POST',
        body: JSON.stringify({
          slug: p.slug,
          name: p.name,
          destination: p.destination,
          unit: p.unit,
          duration: p.duration,
          sort_order: p.sort_order,
          active: p.active,
          price: p.price,
          ...patch,
        }),
      });
      setPackages(j.packages || []);
      setPriceEdits((e) => {
        const n = { ...e };
        delete n[kk];
        return n;
      });
    } finally {
      setSavingKey('');
    }
  };

  const savePrice = (p: Package) => {
    const raw = priceEdits[pkgKey(p)];
    if (raw == null) return;
    const rupees = Number(raw.replace(/[^\d.]/g, ''));
    if (!(rupees >= 1 && rupees <= 1000000)) return;
    savePackage(p, { price: Math.round(rupees * 100) });
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 pt-20 text-white">
        <form onSubmit={signIn} className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#141414] p-8">
          <h1 className="font-sans text-xl">Wild Inn — Admin</h1>
          <p className="mt-1 text-xs text-white/45">Enter the admin passcode to continue.</p>
          <input
            type="password"
            autoFocus
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            placeholder="Passcode"
            className="mt-5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
          />
          {authError && <p className="mt-2 text-[11px] text-rose-400">{authError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 pt-24 pb-20 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <h1 className="font-sans text-2xl">Admin</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => load(key)} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={signOut} className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label="Revenue (paid)" value={formatINR(summary.revenue)} />
          <Tile label="Paid orders" value={String(summary.paid_count)} />
          <Tile label="All orders" value={String(summary.total_count)} />
          <Tile label="Discounts given" value={formatINR(summary.discount_given)} />
        </div>

        {/* Coupons */}
        <section className="mt-10">
          <h2 className="font-sans text-lg text-white/90">Coupons</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/40">
                <tr>
                  <Th>Code</Th><Th>%</Th><Th>Owner</Th><Th>Uses</Th><Th>Paid</Th><Th>Discount given</Th><Th>Max</Th><Th>Active</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((c) => (
                  <tr key={c.code} className="text-white/80">
                    <Td className="font-mono text-white">{c.code}</Td>
                    <Td>{c.percent}%</Td>
                    <Td>{c.owner || '—'}</Td>
                    <Td>{c.uses}</Td>
                    <Td>{c.paid_orders}</Td>
                    <Td>{formatINR(c.discount_total)}</Td>
                    <Td>{c.max_uses ?? '∞'}</Td>
                    <Td>
                      <button
                        onClick={() => toggleCoupon(c)}
                        className={`rounded-full px-2.5 py-1 text-[11px] ${
                          c.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {c.active ? 'Active' : 'Off'}
                      </button>
                    </Td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr><Td className="text-white/40">No coupons.</Td></tr>
                )}
              </tbody>
            </table>
          </div>

          <form onSubmit={addCoupon} className="mt-4 flex flex-wrap items-end gap-2">
            <MiniField label="Code" value={newCoupon.code} onChange={(v) => setNewCoupon({ ...newCoupon, code: v.toUpperCase() })} placeholder="NEWCODE@10" w="w-40" />
            <MiniField label="%" value={newCoupon.percent} onChange={(v) => setNewCoupon({ ...newCoupon, percent: v })} w="w-16" />
            <MiniField label="Owner" value={newCoupon.owner} onChange={(v) => setNewCoupon({ ...newCoupon, owner: v })} placeholder="name" w="w-36" />
            <MiniField label="Max uses" value={newCoupon.max_uses} onChange={(v) => setNewCoupon({ ...newCoupon, max_uses: v })} placeholder="∞" w="w-20" />
            <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black">
              <Plus className="h-3.5 w-3.5" /> Add / update
            </button>
          </form>
        </section>

        {/* Experiences & prices */}
        <section className="mt-12">
          <h2 className="font-sans text-lg text-white/90">Experiences &amp; prices</h2>
          <p className="mt-1 text-xs text-white/40">
            Edit the price charged for each package. Changes apply to new checkouts immediately.
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/40">
                <tr>
                  <Th>Experience</Th><Th>Package</Th><Th>Unit</Th><Th>Price (₹)</Th><Th>Active</Th><Th></Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {packages.map((p) => {
                  const kk = `${p.slug}|${p.name}`;
                  const editing = priceEdits[kk] ?? '';
                  const currentRupees = String(Math.round(p.price / 100));
                  const dirty = editing !== '' && editing !== currentRupees;
                  return (
                    <tr key={kk} className="text-white/80">
                      <Td className="capitalize text-white/90">{p.destination || p.slug}</Td>
                      <Td>{p.name}</Td>
                      <Td className="text-[11px] text-white/45">{p.unit}</Td>
                      <Td>
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/40">₹</span>
                          <input
                            value={editing || currentRupees}
                            onChange={(e) => setPriceEdits((s) => ({ ...s, [kk]: e.target.value.replace(/[^\d]/g, '') }))}
                            onKeyDown={(e) => e.key === 'Enter' && savePrice(p)}
                            className="w-24 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:border-white/30 focus:outline-none"
                          />
                        </div>
                      </Td>
                      <Td>
                        <button
                          onClick={() => savePackage(p, { active: !p.active })}
                          disabled={savingKey === kk}
                          className={`rounded-full px-2.5 py-1 text-[11px] ${
                            p.active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-white/50'
                          }`}
                        >
                          {p.active ? 'On' : 'Off'}
                        </button>
                      </Td>
                      <Td>
                        <button
                          onClick={() => savePrice(p)}
                          disabled={!dirty || savingKey === kk}
                          className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-30"
                        >
                          {savingKey === kk ? '…' : 'Save'}
                        </button>
                      </Td>
                    </tr>
                  );
                })}
                {packages.length === 0 && <tr><Td className="text-white/40">No packages.</Td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        {/* Orders */}
        <section className="mt-12">
          <h2 className="font-sans text-lg text-white/90">Orders</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/40">
                <tr>
                  <Th>Date</Th><Th>Customer</Th><Th>Package</Th><Th>Stay</Th><Th>Pax</Th><Th>Base</Th><Th>Coupon</Th><Th>Discount</Th><Th>Paid</Th><Th>Status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((o) => (
                  <tr key={o.id} className="text-white/80">
                    <Td className="whitespace-nowrap text-white/50">{new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</Td>
                    <Td>
                      <div className="text-white">{o.customer_name || '—'}</div>
                      <div className="text-[11px] text-white/40">{o.customer_phone || o.customer_email || ''}</div>
                    </Td>
                    <Td>
                      <div className="text-white/90">{o.package_name}</div>
                      <div className="text-[11px] text-white/40 capitalize">{o.slug}</div>
                    </Td>
                    <Td className="whitespace-nowrap text-[12px]">
                      {o.check_in_date ? (
                        <>
                          <div className="text-white/80">{formatShortDate(o.check_in_date)}</div>
                          <div className="text-white/40">→ {o.check_out_date ? formatShortDate(o.check_out_date) : '—'}</div>
                        </>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap">
                      <div>{o.adults}A{o.children > 0 ? ` + ${o.children}C` : ''}</div>
                      {o.children_under10 > 0 && (
                        <div className="text-[11px] text-white/40">{o.children_under10} under 10 (50%)</div>
                      )}
                    </Td>
                    <Td>{formatINR(o.base_amount)}</Td>
                    <Td className="font-mono text-[11px]">{o.coupon_code || '—'}</Td>
                    <Td>{o.discount_amount ? `− ${formatINR(o.discount_amount)}` : '—'}</Td>
                    <Td className="text-white">{formatINR(o.amount)}</Td>
                    <Td>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                        o.status === 'paid' ? 'bg-emerald-500/15 text-emerald-300'
                        : o.status === 'failed' ? 'bg-rose-500/15 text-rose-300'
                        : o.status === 'abandoned' ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-white/10 text-white/50'
                      }`}>{STATUS_LABEL[o.status] || o.status}</span>
                    </Td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><Td className="text-white/40">No orders yet.</Td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="mt-1 font-sans text-xl text-white">{value}</div>
    </div>
  );
}
function formatShortDate(iso: string): string {
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}
function Th({ children }: { children?: any }) {
  return <th className="px-3 py-2.5 font-semibold">{children}</th>;
}
function Td({ children, className = '' }: { children: any; className?: string }) {
  return <td className={`px-3 py-2.5 align-top ${className}`}>{children}</td>;
}
function MiniField({ label, value, onChange, placeholder, w }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; w: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-white/40">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${w} rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-sm text-white placeholder:text-white/25 focus:border-white/30 focus:outline-none`}
      />
    </label>
  );
}
