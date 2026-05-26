const RANK_ICONS = ['🥇', '🥈', '🥉'];

export default function LeaderboardRow({ entry, rank, isMe }) {
  const initials = entry.username?.slice(0, 2).toUpperCase();
  const hours = Math.floor((entry.total_minutes || 0) / 60);

  return (
    <div className={`flex items-center gap-3 sm:gap-4 rounded-xl border p-3.5 sm:p-4 transition-all duration-200 hover:border-surface-subtle ${
      isMe
        ? 'bg-brand/5 border-brand/20 shadow-[inset_0_0_0_1px_rgba(232,93,36,0.08)]'
        : 'bg-surface-card border-surface-border'
    }`}>
      {/* Rank */}
      <span className="text-xl w-8 text-center shrink-0">
        {RANK_ICONS[rank - 1] || (
          <span className="text-sm font-bold text-text-muted">#{rank}</span>
        )}
      </span>

      {/* Avatar */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
        isMe
          ? 'bg-gradient-to-br from-brand/30 to-brand/10 text-brand ring-1 ring-brand/20'
          : 'bg-surface-hover text-text-secondary'
      }`}>
        {entry.avatar_url
          ? <img src={entry.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
          : initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {entry.username}
          {isMe && <span className="ml-1.5 text-xs font-normal text-brand">(you)</span>}
        </p>
        <p className="text-xs text-text-muted mt-0.5">{hours}h watched</p>
        {/* Progress bar relative to #1 */}
        <div className="mt-2 h-1.5 bg-surface-raised rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${entry._pct || 0}%`,
              background: isMe
                ? 'linear-gradient(90deg, #E85D24, #FF7A45)'
                : 'linear-gradient(90deg, #383B50, #4B4F66)',
            }}
          />
        </div>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        <p className={`text-lg font-bold ${isMe ? 'text-brand' : 'text-text-primary'}`}>{entry.total_watched}</p>
        <p className="text-xs text-text-muted">films</p>
      </div>
    </div>
  );
}
