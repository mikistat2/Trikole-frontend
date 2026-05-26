const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export default function MovieCard({ movie, onAdd, onClick, isInList, isVerified, isSeries = false }) {
  const year = (movie.release_date || movie.first_air_date)?.slice(0, 4) || '';
  const rating = movie.vote_average?.toFixed(1) || '';
  const title = movie.title || movie.name || '';
  const description = (movie.overview || '').substring(0, 100);
  const posterUrl = movie.poster_path
    ? `${IMG_BASE}/w342${movie.poster_path}`
    : null;

  return (
    <div 
      onClick={() => onClick?.(movie)}
      className="group bg-surface-card rounded-xl border border-surface-border overflow-hidden hover:border-surface-subtle hover:-translate-y-1 hover:shadow-card transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-surface-raised overflow-hidden shrink-0 relative">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-text-muted">
              <rect x="2" y="2" width="20" height="20" rx="3" />
              <circle cx="12" cy="12" r="4" />
              <path d="M2 12h4M18 12h4M12 2v4M12 18v4" />
            </svg>
          </div>
        )}

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs font-medium text-amber-400 flex items-center gap-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating}
          </div>
        )}

        {/* Series badge */}
        {isSeries && (
          <div className="absolute top-2 left-2 bg-brand/80 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs font-semibold text-white">
            TV
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-sm font-semibold text-text-primary leading-tight line-clamp-2 mb-1.5">{title}</p>

        {/* Description */}
        <p className="text-xs text-text-muted line-clamp-2 mb-2.5 flex-1 leading-relaxed">{description}{description && '...'}</p>

        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
          <span className="bg-surface-raised px-2 py-0.5 rounded-md">{year}</span>
        </div>

        <div className="mt-auto">
          {isVerified ? (
            <span className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Watched
            </span>
          ) : isInList && !isSeries ? (
            <span className="flex items-center justify-center text-xs text-text-muted bg-surface-raised px-3 py-2 rounded-lg border border-surface-border">
              In list
            </span>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd?.(movie); }}
              className="w-full text-xs py-2.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark hover:shadow-glow active:scale-[0.97] transition-all duration-200"
            >
              {isSeries ? '+ Pick Season' : '+ Add to list'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
