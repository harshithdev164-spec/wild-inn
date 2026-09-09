import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Film } from 'lucide-react';
import SEO from '../components/SEO';
import ReelPlayer from '../components/ReelPlayer';
import { useReels } from '../hooks/useReels';

export default function Reels() {
  const { reels, loading, error } = useReels();
  const [muted, setMuted] = useState(true);
  const navigate = useNavigate();

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <SEO
        title="Reels"
        description="Short films from Wild Inn safaris across South India — Kabini, Bandipur, Masinagudi and beyond."
      />

      {/* Back */}
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className="absolute left-4 top-24 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-xs transition-colors hover:bg-black/60 sm:left-6"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {loading && (
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      )}

      {!loading && (error || reels.length === 0) && (
        <div className="flex h-full w-full flex-col items-center justify-center px-8 text-center">
          <Film className="mb-4 h-8 w-8 text-white/40" />
          <h1 className="font-sans text-xl font-normal text-white">Reels are on their way</h1>
          <p className="mt-2 max-w-xs text-sm font-light text-white/60">
            {error
              ? 'We could not load the feed just now. Please try again shortly.'
              : 'New short films from the field are being cut. Check back soon.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-6 rounded-full bg-white px-6 py-3 text-xs font-medium text-black"
          >
            Back to home
          </button>
        </div>
      )}

      {!loading && !error && reels.length > 0 && (
        <div className="h-full w-full snap-y snap-mandatory overflow-y-scroll overscroll-contain scroll-smooth">
          {reels.map((reel, i) => (
            <ReelPlayer
              key={reel.id}
              reel={reel}
              muted={muted}
              onToggleMute={() => setMuted((v) => !v)}
              eager={i < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
