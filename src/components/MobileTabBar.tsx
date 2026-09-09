import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Compass, Info, Image, type LucideIcon } from 'lucide-react';

const TABS: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/reels', label: 'Reels', icon: Film },
  { to: '/experiences', label: 'Experiences', icon: Compass },
  { to: '/about', label: 'About', icon: Info },
  { to: '/gallery', label: 'Gallery', icon: Image },
];

export default function MobileTabBar() {
  const { pathname } = useLocation();

  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <nav
      id="mobile-tab-bar"
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center md:hidden"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
    >
      <ul className="flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2 py-2 shadow-lg shadow-black/40 backdrop-blur-xl">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = isActive(to);
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  active ? 'bg-white/15 text-white' : 'text-white/55 hover:text-white/90'
                }`}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.4 : 2} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
