import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi, leaderboardApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';

const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export default function AppProfilePage() {
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
    <div className="pt-12 pb-6">
      {/* Avatar + name */}
      <div className="px-4 flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center text-2xl font-bold text-brand">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{user?.username}</h1>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-500"
        >
          Sign out
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="px-4 grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Verified', value: stats.total_watched },
            { label: 'Hours', value: Math.floor(stats.total_minutes / 60) },
            { label: 'Today', value: stats.daily?.[0]?.count || 0 },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Top genres */}
      {stats?.top_genres?.length > 0 && (
        <div className="px-4 mb-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Top genres</p>
          <div className="flex flex-wrap gap-2">
            {stats.top_genres.map(g => (
              <span key={g.genre} className="text-xs px-2.5 py-1 bg-brand/10 text-brand rounded-full font-medium">
                {g.genre} ({g.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Watch history poster wall */}
      <div className="px-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Watch history</p>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">No verified watches yet</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {history.map(w => (
              <div key={w.tmdb_id} className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100">
                {w.poster_path
                  ? <img src={`${IMG_BASE}/w154${w.poster_path}`} alt={w.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-lg">🎬</div>
                }
                <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs leading-none">✓</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
