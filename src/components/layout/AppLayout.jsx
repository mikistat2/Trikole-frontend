import { Outlet, NavLink } from 'react-router-dom';
import BrandMark from '@/components/common/BrandMark';

/* ─── SVG icon components (outlined) ────────────────── */
const tabIcons = {
  home: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      {!active && <polyline points="9 22 9 12 15 12 15 22" />}
    </svg>
  ),
  browse: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  list: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M9 5H7a2 2 0 00-2 2v12l7-4 7 4V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  ),
  board: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M18 2H6v7a6 6 0 1012 0V2z" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.24 7 20v2" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 19.24 17 20v2" />
    </svg>
  ),
  me: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 10-16 0" />
    </svg>
  ),
  aisug: (active) => (
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
};

const tabs = [
  { to: '/home', label: 'Home', icon: tabIcons.home },
  { to: '/browse', label: 'Browse', icon: tabIcons.browse },
  { to: '/ai-sug', label: 'AI Sug', icon: tabIcons.aisug },
  { to: '/watchlist', label: 'List', icon: tabIcons.list },
  { to: '/leaderboard', label: 'Board', icon: tabIcons.board },
  { to: '/profile', label: 'Me', icon: tabIcons.me },
];

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen bg-surface">
      <header className="fixed top-0 inset-x-0 z-40 h-14 glass-strong safe-top flex items-center justify-center px-4 border-b border-surface-border">
        <BrandMark imageSize={22} textSize={18} />
      </header>

      {/* Content area — scrollable, sits above tab bar */}
      <main className="flex-1 overflow-auto pt-14 pb-20">
        <Outlet />
      </main>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 glass-strong safe-bottom z-50 border-t border-surface-border">
        <div className="flex">
          {tabs.map(t => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === '/'}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2.5 text-xs font-medium transition-all duration-200
                ${isActive
                  ? 'text-brand'
                  : 'text-text-muted active:text-text-secondary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    {t.icon(isActive)}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand" />
                    )}
                  </div>
                  <span className="mt-1">{t.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
