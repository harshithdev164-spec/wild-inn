import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Search, X, CornerDownLeft, ChevronDown } from 'lucide-react';
import { buildSearchIndex, searchEntries, type SearchEntry } from '../data/searchIndex';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const GROUP_ORDER: SearchEntry['group'][] = ['Experiences', 'Pages', 'FAQ'];

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const index = useMemo(() => buildSearchIndex(), []);
  const results = useMemo(() => searchEntries(index, query), [index, query]);

  // Reset + focus on open; lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    setOpenFaq(null);
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const select = (entry: SearchEntry) => {
    if (entry.group === 'FAQ') {
      setOpenFaq((cur) => (cur === entry.id ? null : entry.id));
      return;
    }
    if (entry.to) {
      onClose();
      navigate(entry.to);
    }
  };

  const onKeyDown = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === 'Escape') return onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      select(results[active]);
    }
  };

  const grouped = GROUP_ORDER.map((g) => ({ group: g, items: results.filter((r) => r.group === g) })).filter(
    (x) => x.items.length > 0
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            onKeyDown={onKeyDown}
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <Search className="h-4 w-4 shrink-0 text-white/40" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search experiences, packages, pages…"
                className="w-full bg-transparent py-4 text-sm text-white placeholder:text-white/35 focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="shrink-0 rounded-md p-1 text-white/40 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[52vh] overflow-y-auto overscroll-contain py-2">
              {query.trim() === '' && (
                <p className="px-4 py-6 text-center text-xs text-white/35">
                  Try “Kabini”, “romantic”, “boat safari”, or “what to pack”.
                </p>
              )}

              {query.trim() !== '' && grouped.length === 0 && (
                <p className="px-4 py-6 text-center text-xs text-white/40">
                  No results for “{query.trim()}”.
                </p>
              )}

              {grouped.map(({ group, items }) => (
                <div key={group} className="px-2 pb-1">
                  <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                    {group}
                  </div>
                  {items.map((entry) => {
                    const idx = results.indexOf(entry);
                    const isActive = idx === active;
                    const isFaqOpen = openFaq === entry.id;
                    return (
                      <div key={entry.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => select(entry)}
                          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors ${
                            isActive ? 'bg-white/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-white">{entry.title}</span>
                            {entry.subtitle && (
                              <span className="mt-0.5 block truncate text-xs text-white/45">{entry.subtitle}</span>
                            )}
                          </span>
                          {entry.group === 'FAQ' ? (
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 text-white/30 transition-transform ${isFaqOpen ? 'rotate-180' : ''}`}
                            />
                          ) : (
                            isActive && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-white/40" />
                          )}
                        </button>
                        {entry.group === 'FAQ' && isFaqOpen && entry.answer && (
                          <p className="px-2.5 pb-3 pt-1 text-xs leading-relaxed text-white/60">{entry.answer}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="hidden items-center gap-4 border-t border-white/10 px-4 py-2.5 text-[10px] text-white/30 sm:flex">
              <span><kbd className="rounded bg-white/10 px-1.5 py-0.5">↑</kbd> <kbd className="rounded bg-white/10 px-1.5 py-0.5">↓</kbd> navigate</span>
              <span><kbd className="rounded bg-white/10 px-1.5 py-0.5">↵</kbd> select</span>
              <span><kbd className="rounded bg-white/10 px-1.5 py-0.5">esc</kbd> close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
