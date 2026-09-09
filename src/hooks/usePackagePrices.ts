import { useEffect, useState } from 'react';
import { formatINR } from '../lib/money';

type LivePkg = { slug: string; name: string; price: number; unit: string; duration: string; active: boolean };

/**
 * Fetches the live (admin-editable) package prices from /api/packages.
 * Falls back silently to the static destinationsData prices when the API is unavailable.
 */
export function usePackagePrices() {
  const [map, setMap] = useState<Record<string, LivePkg>>({});

  useEffect(() => {
    const ctrl = new AbortController();
    fetch('/api/packages', { signal: ctrl.signal, headers: { accept: 'application/json' } })
      .then((r) => (r.ok && r.headers.get('content-type')?.includes('json') ? r.json() : null))
      .then((j: { packages?: LivePkg[] } | null) => {
        if (!j?.packages) return;
        const next: Record<string, LivePkg> = {};
        for (const p of j.packages) next[`${p.slug}|${p.name}`] = p;
        setMap(next);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  /** Returns a package object with the live price string merged in (or the original if no override). */
  const withLivePrice = <T extends { name: string; price: string; unit: string; duration: string }>(
    slug: string,
    pkg: T
  ): T => {
    const live = map[`${slug}|${pkg.name}`];
    if (!live || !live.active) return pkg;
    return { ...pkg, price: formatINR(live.price), unit: live.unit, duration: live.duration };
  };

  return { withLivePrice, hasLive: Object.keys(map).length > 0 };
}
