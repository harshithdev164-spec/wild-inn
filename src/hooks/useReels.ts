import { useEffect, useState } from 'react';
import type { Reel } from '../types';

type State = {
  reels: Reel[];
  loading: boolean;
  error: string | null;
};

// Live endpoint (needs a Node server); the static file is baked at build time
// (scripts/build-reels-data.mjs) and works on plain static hosting.
const SOURCES = ['/api/reels', '/reels-data.json'];

async function loadReels(signal: AbortSignal): Promise<Reel[]> {
  let lastErr: unknown;
  for (const url of SOURCES) {
    try {
      const res = await fetch(url, { signal, headers: { accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // A static host answers /api/reels with index.html (SPA fallback) — reject non-JSON.
      if (!res.headers.get('content-type')?.includes('json')) throw new Error('not json');
      const data = (await res.json()) as { reels?: Reel[] };
      return Array.isArray(data.reels) ? data.reels : [];
    } catch (err) {
      if ((err as Error).name === 'AbortError') throw err;
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Failed to load reels');
}

/** Loads the reel feed: tries the live API, falls back to the baked static file. */
export function useReels(): State {
  const [state, setState] = useState<State>({ reels: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    loadReels(controller.signal)
      .then((reels) => {
        if (!cancelled) setState({ reels, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled || (err as Error).name === 'AbortError') return;
        setState({ reels: [], loading: false, error: (err as Error).message || 'Failed to load reels' });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return state;
}
