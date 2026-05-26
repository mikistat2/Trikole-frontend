import { useEffect, useState } from 'react';
import { useWatchlistStore } from '@/store/watchlist.store';
import WatchlistItem from '@/components/common/WatchlistItem';
import VerifyModal from '@/components/common/VerifyModal';

export default function AppWatchlistPage() {
  const { items, loading, fetch, updateStatus, remove } = useWatchlistStore();
  const [verifyTarget, setVerifyTarget] = useState(null);

  useEffect(() => { fetch(); }, [fetch]);

  async function handleStart(item) {
    await updateStatus(item.id, 'watching');
  }

  const verified  = items.filter(i => i.status === 'verified').length;
  const total     = items.length;

  return (
    <div className="px-4 pt-12 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold">Today's Queue</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand">{verified}<span className="text-sm text-gray-300 font-normal">/{total}</span></p>
          <p className="text-xs text-gray-400">done</p>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-700"
            style={{ width: `${Math.round((verified / total) * 100)}%` }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-3">🎬</p>
          <p className="text-sm font-medium mb-1">Queue is empty</p>
          <p className="text-xs">Browse movies and add them to your list</p>
        </div>
      ) : (
        <div className="space-y-2">
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
        <VerifyModal movie={verifyTarget} onClose={() => setVerifyTarget(null)} />
      )}
    </div>
  );
}
