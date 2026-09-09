import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Play, ArrowUpRight } from 'lucide-react';
import type { Reel } from '../types';

interface ReelPlayerProps {
  // This project has no @types/react, so `key` isn't stripped from JSX props by TS.
  key?: string | number;
  reel: Reel;
  muted: boolean;
  onToggleMute: () => void;
  /** Preload the video element even while off-screen (used for the next reel). */
  eager?: boolean;
}

const isHls = (url: string) => /\.m3u8(\?|$)/i.test(url);

export default function ReelPlayer({ reel, muted, onToggleMute, eager = false }: ReelPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  // Play only while the reel occupies most of the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Attach the source (native HLS, hls.js, or a plain file).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || (!inView && !eager)) return;

    let destroyed = false;
    let hls: { destroy: () => void } | null = null;

    const src = reel.video_url;
    if (isHls(src) && !video.canPlayType('application/vnd.apple.mpegurl')) {
      import('hls.js')
        .then(({ default: Hls }) => {
          if (destroyed) return;
          if (Hls.isSupported()) {
            const instance = new Hls({ maxBufferLength: 20 });
            instance.loadSource(src);
            instance.attachMedia(video);
            hls = instance;
          } else {
            video.src = src;
          }
        })
        .catch(() => {
          video.src = src;
        });
    } else if (video.src !== src) {
      video.src = src;
    }

    return () => {
      destroyed = true;
      hls?.destroy();
    };
  }, [reel.video_url, inView, eager]);

  // React only sets the `muted` attribute on mount, so sync it imperatively.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // Drive play/pause from visibility + user toggle.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !paused) {
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      video.pause();
      if (!inView) {
        video.currentTime = 0;
        setPaused(false);
      }
    }
  }, [inView, paused]);

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full snap-start snap-always shrink-0 overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={reel.poster_url ?? undefined}
        muted={muted}
        loop
        playsInline
        preload={eager ? 'auto' : 'metadata'}
        onClick={() => setPaused((v) => !v)}
      />

      {/* Legibility gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />

      {/* Paused indicator */}
      {paused && inView && (
        <button
          type="button"
          onClick={() => setPaused(false)}
          aria-label="Play"
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/45 backdrop-blur-xs">
            <Play className="h-7 w-7 translate-x-0.5 text-white" fill="currentColor" />
          </span>
        </button>
      )}

      {/* Mute toggle */}
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="absolute right-4 top-24 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xs transition-colors hover:bg-black/60 sm:right-6"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-28 pt-10 sm:px-8 sm:pb-32">
        <div className="mx-auto max-w-2xl">
          {reel.location && (
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D39E82]" />
              {reel.location}
            </span>
          )}
          <h2 className="font-sans text-2xl font-normal leading-tight tracking-tight text-white sm:text-3xl">
            {reel.title}
          </h2>
          {reel.description && (
            <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-white/80">
              {reel.description}
            </p>
          )}
          {reel.tour_slug && (
            <Link
              to={`/experiences/${reel.tour_slug}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-medium text-black transition-transform hover:scale-[1.02]"
            >
              View this experience
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
