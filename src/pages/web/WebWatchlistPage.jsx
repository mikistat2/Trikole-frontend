import { useEffect, useState } from 'react';
import { useWatchlistStore } from '@/store/watchlist.store';
import WatchlistItem from '@/components/common/WatchlistItem';
import VerifyModal from '@/components/common/VerifyModal';

export default function WebWatchlistPage() {
  const { items, loading, fetch, updateStatus, remove } = useWatchlistStore();
  const [verifyTarget, setVerifyTarget] = useState(null);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleStart(item) {
    await updateStatus(item.id, 'watching');
  }

  const verifiedCount = items.filter(i => i.status === 'verified').length;

  return (
    <div className="p-4 sm:p-6 max-w-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">Today's Queue</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand">
            {verifiedCount}
          </p>
          <p className="text-xs text-text-muted">verified today</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl">
              <div className="w-12 h-[4.5rem] shimmer rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 shimmer rounded" />
                <div className="h-3 w-1/3 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-text-muted">
              <rect x="2" y="2" width="20" height="20" rx="3" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <p className="text-sm text-text-muted">Browse movies and add them to your queue</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map(item => (
            <WatchlistItem
              key={item.id}
              item={item}
              onStart={handleStart}
              onDone={setVerifyTarget}
              onRemove={remove}
            />
          ))}
        </div>
      )}

      {verifyTarget && (
        <VerifyModal
          movie={verifyTarget}
          onClose={() => setVerifyTarget(null)}
        />
      )}
    </div>
  );
}
