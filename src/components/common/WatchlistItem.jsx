const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

const STATUS_STYLES = {
  queued:   'bg-surface-raised text-text-muted border-surface-border',
  watching: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  failed:   'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_LABELS = {
  queued: 'Queued', watching: 'Watching', verified: '✓ Verified', failed: 'Failed',
};

export default function WatchlistItem({
  item, onStart, onDone, onRemove,
}) {
  const posterUrl = item.poster_path
    ? `${IMG_BASE}/w92${item.poster_path}`
    : null;

  const isSeries = item.media_type === 'series';
  const seasonLabel = isSeries && item.season_number != null
    ? `S${item.season_number}`
    : null;

  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-surface-card rounded-xl border border-surface-border p-3 sm:p-4 hover:border-surface-subtle transition-all duration-200 animate-fade-in">
      {/* Poster */}
      <div className="w-11 h-16 sm:w-12 sm:h-[4.5rem] rounded-lg overflow-hidden bg-surface-raised shrink-0 flex items-center justify-center relative">
        {posterUrl ? (
          <img src={posterUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-text-muted">
            <rect x="2" y="2" width="20" height="20" rx="3" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        )}
        {/* Season badge */}
        {seasonLabel && (
          <div className="absolute bottom-0.5 right-0.5 bg-brand/90 text-white text-[10px] font-bold px-1 py-0.5 rounded leading-none">
            {seasonLabel}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-text-muted">{item.release_year || ''}</p>
          {isSeries && (
            <span className="text-[10px] font-semibold text-brand bg-brand/10 px-1.5 py-0.5 rounded">TV</span>
          )}
        </div>
        <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium border ${STATUS_STYLES[item.status] || STATUS_STYLES.queued}`}>
          {STATUS_LABELS[item.status] || 'Queued'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {item.status === 'queued' && (
          <button
            onClick={() => onStart(item)}
            className="text-xs px-3.5 py-2 rounded-lg border border-surface-border text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all duration-200 active:scale-95"
          >
            Start
          </button>
        )}
        {item.status === 'watching' && (
          <button
            onClick={() => onDone(item)}
            className="text-xs px-3.5 py-2 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark hover:shadow-glow transition-all duration-200 active:scale-95"
          >
            Done →
          </button>
        )}
        {(item.status === 'queued' || item.status === 'failed') && (
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs px-3.5 py-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 active:scale-95"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
