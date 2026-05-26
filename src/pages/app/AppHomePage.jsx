import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leaderboardApi } from '@/api';
import { useWatchlistStore } from '@/store/watchlist.store';
import { useAuthStore } from '@/store/auth.store';

export default function AppHomePage() {
  const { user } = useAuthStore();
  const { items, fetch } = useWatchlistStore();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch();
    leaderboardApi.getMyStats().then(r => setStats(r.data)).catch(() => {});
  }, [fetch]);

  const verified = items.filter(i => i.status === 'verified').length;
  const watching = items.find(i => i.status === 'watching');

  return (
    <div className="px-4 pt-12 pb-6">
      <div className="mb-6">
        <p className="text-sm text-gray-400">Welcome back,</p>
        <h1 className="text-2xl font-semibold">{user?.username} 👋</h1>
      </div>

      <div className="bg-brand rounded-2xl p-5 text-white mb-4">
        <p className="text-sm text-white/70 mb-1">Today's progress</p>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-4xl font-bold">{verified}</span>
          <span className="text-white/70 mb-1">movies verified</span>
        </div>
        <div className="flex gap-3">
          <Link to="/browse" className="flex-1 text-center text-sm py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium">
            Browse movies
          </Link>
          <Link to="/watchlist" className="flex-1 text-center text-sm py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium">
            My list ({items.length})
          </Link>
        </div>
      </div>

      {watching && (
        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-4">
          <p className="text-xs font-medium text-yellow-600 mb-1">Currently watching</p>
          <p className="text-sm font-medium text-gray-800 mb-2">{watching.title}</p>
          <Link to="/watchlist" className="text-xs text-yellow-700 font-medium underline underline-offset-2">
            Mark as done →
          </Link>
        </div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-semibold">{stats.total_watched}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total verified</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-2xl font-semibold">{Math.floor(stats.total_minutes / 60)}</p>
            <p className="text-xs text-gray-400 mt-0.5">Hours watched</p>
          </div>
        </div>
      )}

      <Link to="/leaderboard" className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4">
        <div>
          <p className="text-sm font-medium">🏆 Leaderboard</p>
          <p className="text-xs text-gray-400 mt-0.5">See how you rank</p>
        </div>
        <span className="text-gray-300 text-lg">›</span>
      </Link>
    </div>
  );
}
