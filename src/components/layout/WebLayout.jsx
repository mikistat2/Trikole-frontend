import { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

/* ─── SVG icon components ────────────────────────────── */
const icons = {
  browse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <circle cx="12" cy="12" r="4" />
      <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
    </svg>
  ),
  watchlist: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 5H7a2 2 0 00-2 2v12l7-4 7 4V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
    </svg>
  ),
  leaderboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.24 7 20v2" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 19.24 17 20v2" />
      <path d="M18 2H6v7a6 6 0 1012 0V2z" />
    </svg>
  ),
  rooms: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 10-16 0" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  aisug: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  collapse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="11 17 6 12 11 7" />
      <polyline points="18 17 13 12 18 7" />
    </svg>
  ),
  expand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="13 17 18 12 13 7" />
      <polyline points="6 17 11 12 6 7" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="18" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const links = [
  { to: '/browse', label: 'Browse', icon: icons.browse },
  { to: '/watchlist', label: 'My List', icon: icons.watchlist },
  { to: '/leaderboard', label: 'Leaderboard', icon: icons.leaderboard },
  { to: '/rooms', label: 'Rooms', icon: icons.rooms },
  { to: '/ai-sug', label: 'AI Sug', icon: icons.aisug },
  { to: '/profile', label: 'Profile', icon: icons.profile },
];

export default function WebLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on nav
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="relative flex min-h-screen bg-surface">
      {/* ─── Mobile header bar ─── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 h-14 glass-strong flex items-center px-4 safe-top">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 active:scale-95"
          aria-label="Open sidebar"
        >
          {icons.menu}
        </button>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-base font-extrabold tracking-tight text-text-primary">
            Trick<span className="text-brand">ole</span>
          </span>
        </div>
        <div className="w-10" /> {/* Spacer for symmetry */}
      </header>

      {/* ─── Mobile overlay ─── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50 h-screen
          flex flex-col
          bg-surface-raised border-r border-surface-border
          shadow-sidebar
          transition-all duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${collapsed ? 'md:w-[72px]' : 'md:w-60'}
          w-64
        `}
      >
        {/* Brand */}
        <div className="px-4 py-5 border-b border-surface-border flex items-center gap-3">
          <span className={`text-base font-extrabold tracking-tight text-text-primary transition-all duration-300 whitespace-nowrap ${collapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100'}`}>
            Trick<span className="text-brand">ole</span>
          </span>

          {/* Desktop collapse button */}
          <button
            type="button"
            onClick={() => setCollapsed(v => !v)}
            className={`hidden md:flex ml-auto w-7 h-7 rounded-lg items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-200 active:scale-95 ${collapsed ? 'md:ml-0' : ''}`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? icons.expand : icons.collapse}
          </button>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all"
            aria-label="Close sidebar"
          >
            {icons.close}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${collapsed ? 'md:justify-center md:px-2' : 'px-3'}
                ${isActive
                  ? 'bg-brand/10 text-brand shadow-[inset_0_0_0_1px_rgba(232,93,36,0.15)]'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`
              }
              title={collapsed ? l.label : undefined}
            >
              {/* Active indicator line */}
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-brand rounded-r-full" />
                  )}
                  <span className="shrink-0">{l.icon}</span>
                  <span className={`transition-all duration-300 whitespace-nowrap ${collapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100'}`}>
                    {l.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-surface-border">
          <div className={`flex items-center gap-3 py-2 ${collapsed ? 'md:justify-center md:px-0' : 'px-2'}`}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand/30 to-brand/10 flex items-center justify-center text-sm font-bold text-brand shrink-0 ring-1 ring-brand/20">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'opacity-100'}`}>
              <p className="text-sm font-medium text-text-primary truncate">{user?.username}</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 shrink-0 ${collapsed ? 'md:hidden' : ''}`}
              title="Sign out"
            >
              {icons.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main content ─── */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
