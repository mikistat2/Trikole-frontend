import { useEffect, useState } from 'react';
import { seriesApi } from '@/api';

const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

/**
 * SeasonPickerModal
 *
 * Shows when a user wants to add a TV series to their watchlist.
 * Fetches series detail from TMDB, displays all seasons with poster,
 * episode count, and air date. User picks a season (or "Add all")
 * and it calls onAddSeason for each selected season.
 *
 * Props:
 *  - series: the TMDB series object from browse results
 *  - onAddSeason(seasonData): called for each season the user picks
 *  - onClose(): close the modal
 *  - existingSeasons: Set of season numbers already in the watchlist for this tmdb_id
 */
export default function SeasonPickerModal({ series, onAddSeason, onClose, existingSeasons = new Set() }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(new Set()); // seasons currently being added
  const [added, setAdded] = useState(new Set(existingSeasons));
  const [error, setError] = useState(null);

  const seriesName = series.name || series.title || '';
  const posterUrl = series.poster_path ? `${IMG_BASE}/w342${series.poster_path}` : null;

  useEffect(() => {
    async function loadDetail() {
      try {
        const res = await seriesApi.getDetail(series.id);
        setDetail(res.data);
      } catch (e) {
        setError('Failed to load series details');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [series.id]);

  async function handleAddSeason(season) {
    if (added.has(season.season_number) || adding.has(season.season_number)) return;

    setAdding(prev => new Set(prev).add(season.season_number));

    try {
      await onAddSeason({
        tmdb_id: series.id,
        title: `${seriesName} – Season ${season.season_number}`,
        poster_path: season.poster_path || series.poster_path,
        release_year: season.air_date?.slice(0, 4),
        genres: series.genre_ids?.map(String) || detail?.genres?.map(g => String(g.id)) || [],
        media_type: 'series',
        season_number: season.season_number,
        total_seasons: detail?.number_of_seasons || seasons.length,
        runtime_min: (season.episode_count || 0) * (detail?.episode_run_time?.[0] || 45),
      });
      setAdded(prev => new Set(prev).add(season.season_number));
    } catch (e) {
      // ignore — store will handle
    } finally {
      setAdding(prev => {
        const next = new Set(prev);
        next.delete(season.season_number);
        return next;
      });
    }
  }

  async function handleAddAll() {
    if (!seasons.length) return;
    for (const season of seasons) {
      if (!added.has(season.season_number)) {
        await handleAddSeason(season);
      }
    }
  }

  // Filter out "Specials" (season_number === 0) unless it's the only season
  const seasons = (detail?.seasons || []).filter(
    s => s.season_number > 0 || detail?.seasons?.length === 1
  );

  const allAdded = seasons.length > 0 && seasons.every(s => added.has(s.season_number));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="glass-strong rounded-2xl w-full max-w-lg shadow-modal animate-scale-in max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="p-5 sm:p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-text-primary">Add Series</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-all duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Series info strip */}
          <div className="flex items-center gap-3 bg-surface-raised rounded-xl p-3 mb-4 border border-surface-border">
            {posterUrl ? (
              <img src={posterUrl} alt="" className="w-12 h-[4.5rem] rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-12 h-[4.5rem] rounded-lg bg-surface-card flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-text-muted">
                  <rect x="2" y="2" width="20" height="20" rx="3" /><circle cx="12" cy="12" r="4" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text-primary truncate">{seriesName}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {series.first_air_date?.slice(0, 4) || ''}
                {detail && ` • ${detail.number_of_seasons} season${detail.number_of_seasons !== 1 ? 's' : ''}`}
              </p>
              {detail?.vote_average > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-amber-400">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs text-text-muted">{detail.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Add all button */}
          {!loading && seasons.length > 1 && (
            <button
              onClick={handleAddAll}
              disabled={allAdded}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold mb-4 transition-all duration-200 ${
                allAdded
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                  : 'bg-brand text-white hover:bg-brand-dark hover:shadow-glow active:scale-[0.98]'
              }`}
            >
              {allAdded ? '✓ All seasons added' : `+ Add all ${seasons.length} seasons`}
            </button>
          )}

          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            Select seasons
          </p>
        </div>

        {/* Scrollable seasons list */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 pb-5 sm:pb-6 no-scrollbar">
          {loading ? (
            <div className="space-y-3 py-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="w-14 h-20 shimmer rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 shimmer rounded" />
                    <div className="h-3 w-1/3 shimmer rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : seasons.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-text-muted">No seasons found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {seasons.map(season => {
                const isAdded = added.has(season.season_number);
                const isAdding = adding.has(season.season_number);
                const sPoster = season.poster_path
                  ? `${IMG_BASE}/w154${season.poster_path}`
                  : posterUrl;

                return (
                  <div
                    key={season.season_number}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                      isAdded
                        ? 'border-emerald-500/20 bg-emerald-500/5'
                        : 'border-surface-border bg-surface-card hover:border-surface-subtle'
                    }`}
                  >
                    {/* Season poster */}
                    <div className="w-12 h-[4.5rem] rounded-lg overflow-hidden bg-surface-raised shrink-0">
                      {sPoster ? (
                        <img src={sPoster} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted text-xs font-bold">
                          S{season.season_number}
                        </div>
                      )}
                    </div>

                    {/* Season info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        Season {season.season_number}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
                        {season.air_date && ` • ${season.air_date.slice(0, 4)}`}
                      </p>
                      {season.overview && (
                        <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed">
                          {season.overview}
                        </p>
                      )}
                    </div>

                    {/* Add button */}
                    <div className="shrink-0">
                      {isAdded ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Added
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddSeason(season)}
                          disabled={isAdding}
                          className="text-xs px-3.5 py-2 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark hover:shadow-glow active:scale-95 transition-all duration-200 disabled:opacity-50"
                        >
                          {isAdding ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Adding
                            </span>
                          ) : (
                            '+ Add'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
