import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchModal from './SearchModal';
import logoUrl from '../assets/logo.webp';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cmd/Ctrl+K opens search anywhere; "/" opens it when not typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
        return;
      }
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
      if (k === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const navLinks = [
    { name: 'Reels', path: '/reels' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-black/70 backdrop-blur-md border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 relative">

            {/* Left: Logo and Brand */}
            <div className="flex items-center">
              <Link id="logo-link" to="/" className="flex items-center space-x-3 group">
                <img
                  src={logoUrl}
                  alt="Wild Inn Tiger Logo"
                  className="w-9 h-9 rounded-full object-cover border border-white/10 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="flex items-baseline gap-1.5">
                  <span className="font-sans text-[17px] font-semibold tracking-wide text-white">
                    Wild Inn
                  </span>
                  <span className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-white/45">
                    Expedition
                  </span>
                </span>
              </Link>
            </div>

            {/* Right: Search + nav links (Desktop) / Search icon (Mobile) */}
            <div className="flex items-center gap-3">
              {/* Desktop search pill */}
              <button
                type="button"
                id="nav-search-desktop"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs text-white/55 transition-colors hover:bg-white/10 hover:text-white/80"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
                <kbd className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-sans text-white/50">⌘K</kbd>
              </button>

              {/* Mobile search bar */}
              <button
                type="button"
                id="nav-search-mobile"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="md:hidden flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs text-white/70 backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search</span>
              </button>

              <div className="hidden md:flex items-center space-x-7">
                {navLinks.map((link) => (
                  <Link
                    id={`nav-link-${link.name.toLowerCase()}`}
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                      location.pathname === link.path
                        ? 'font-semibold text-white border-b border-white pb-1'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  id="nav-cta-plan-safari"
                  to="/contact"
                  className="font-sans font-medium text-xs tracking-wider uppercase px-5 py-2.5 rounded-full shadow-sm transition-all hover:scale-102 bg-white text-black hover:bg-white/90"
                >
                  Plan my Safari
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
