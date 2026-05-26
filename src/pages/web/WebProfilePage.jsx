import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi, leaderboardApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';

const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export default function WebProfilePage() {
  const { user, logout } = useAuthStore();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [h, s] = await Promise.all([
          usersApi.getHistory(),
          leaderboardApi.getMyStats(),
        ]);
        setHistory(h.data);
        setStats(s.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand/30 to-brand/10 flex items-center justify-center text-xl font-bold text-brand ring-2 ring-brand/20">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">{user?.username}</h1>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          {[
            { label: 'Movies verified', value: stats.total_watched },
            { label: 'Hours watched', value: Math.floor(stats.total_minutes / 60) },
            { label: 'Today', value: stats.daily?.[0]?.count || 0 },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <p className="text-2xl sm:text-3xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top genres */}
      {stats?.top_genres?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Top genres</h2>
          <div className="flex flex-wrap gap-2">
            {stats.top_genres.map(g => (
              <span key={g.genre} className="chip-brand">
                {g.genre} <span className="opacity-60">({g.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Watch history */}
      <div>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Watch history</h2>
        {loading ? (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] shimmer rounded-lg" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-text-muted">No verified watches yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {history.map(w => (
              <div key={w.tmdb_id} className="relative group">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-surface-card border border-surface-border">
                  {w.poster_path ? (
                    <img src={`${IMG_BASE}/w154${w.poster_path}`} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-text-muted">
                        <rect x="2" y="2" width="20" height="20" rx="3" /><circle cx="12" cy="12" r="4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                  <p className="text-white text-xs font-medium leading-tight line-clamp-2">{w.title}</p>
                </div>
                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
