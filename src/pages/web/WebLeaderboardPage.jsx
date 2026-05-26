import { useEffect, useState } from 'react';
import { leaderboardApi, settingsApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';
import LeaderboardRow from '@/components/common/LeaderboardRow';

export default function WebLeaderboardPage() {
  const [entries, setEntries] = useState([]);
  const [myStats, setMyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        const [lb, stats, msgRes] = await Promise.all([
          leaderboardApi.getGlobal(),
          leaderboardApi.getMyStats(),
          settingsApi.get('leaderboard_message').catch(() => ({ data: { value: '' } })),
        ]);
        const maxCount = lb.data[0]?.total_watched || 1;
        const withPct = lb.data.map(e => ({
          ...e,
          _pct: Math.round((e.total_watched / maxCount) * 100),
        }));
        setEntries(withPct);
        setMyStats(stats.data);
        if (msgRes?.data?.value) {
          setMessage(msgRes.data.value);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-2xl animate-fade-in">
      <h1 className="page-header mb-1">Leaderboard</h1>
      <p className="page-subtitle mb-6">Global rankings — all verified watches</p>

      {/* Leaderboard Message Box */}
      <div className="mb-6 relative group overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 via-surface-card to-surface-card shadow-glow">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand/10 blur-[40px] -ml-12 -mb-12 pointer-events-none" />
        
        <div className="p-5 relative z-10">
          <div className="flex gap-4 items-start">
            <div className="mt-0.5 shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-brand/20 text-brand shadow-inner ring-1 ring-brand/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-1 opacity-90">Prize Pool & Announcements</h3>
              <p className="text-text-primary font-medium text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {message || 'Welcome to the leaderboard! Participate and climb the ranks.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {myStats && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Verified', value: myStats.total_watched },
            { label: 'Hours', value: Math.floor(myStats.total_minutes / 60) },
            { label: 'Today', value: myStats.daily?.[0]?.count || 0 },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl">
              <div className="w-8 h-8 shimmer rounded-full" />
              <div className="w-10 h-10 shimmer rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 shimmer rounded" />
                <div className="h-1.5 w-full shimmer rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {entries.map((e, i) => (
            <LeaderboardRow key={e.id} entry={e} rank={i + 1} isMe={e.id === user?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
