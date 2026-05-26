import { useState, useEffect, useCallback } from 'react';
import { moviesApi, seriesApi } from '@/api';
import { useWatchlistStore } from '@/store/watchlist.store';
import MovieCard from '@/components/common/MovieCard';
import SeasonPickerModal from '@/components/common/SeasonPickerModal';
import MovieDetailsModal from '@/components/common/MovieDetailsModal';

const GENRES = [
  { id: null, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10749, name: 'Romance' },
  { id: 16, name: 'Animation' },
];

export default function AppBrowsePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('movies');
  const [seasonPickerTarget, setSeasonPickerTarget] = useState(null);
  const [detailModalTarget, setDetailModalTarget] = useState(null);

  const { items: watchlist, add, fetch: fetchWatchlist } = useWatchlistStore();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const api = type === 'series' ? seriesApi : moviesApi;
      let res;
      if (query) res = await api.search(query, page);
      else if (activeGenre) res = await api.getByGenre(activeGenre, page);
      else res = await api.getPopular(page);
      setMovies(prev => page === 1 ? res.data.results : [...prev, ...res.data.results]);
    } catch { /* network handled gracefully */ }
    finally { setLoading(false); }
  }, [query, activeGenre, page, type]);

  useEffect(() => { setPage(1); setMovies([]); }, [query, activeGenre, type]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetchWatchlist(); }, [fetchWatchlist]);

  // Add a movie directly
  async function handleAddMovie(movie) {
    await add({
      tmdb_id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      release_year: (movie.release_date || movie.first_air_date)?.slice(0, 4),
      genres: movie.genre_ids?.map(String),
      media_type: 'movie',
    });
  }

  // When user clicks "+Add" — series opens season picker, movie adds directly
  function handleAdd(movie) {
    if (type === 'series') {
      setSeasonPickerTarget(movie);
    } else {
      handleAddMovie(movie);
    }
  }

  async function handleAddSeason(seasonData) {
    await add(seasonData);
  }

  const watchlistIds = new Set(watchlist.map(w => w.tmdb_id));
  const verifiedIds = new Set(watchlist.filter(w => w.status === 'verified').map(w => w.tmdb_id));

  const existingSeasons = seasonPickerTarget
    ? new Set(
      watchlist
        .filter(w => w.tmdb_id === seasonPickerTarget.id && w.season_number != null)
        .map(w => w.season_number)
    )
    : new Set();

  return (
    <div className="pb-4">
      {/* Sticky search + type + genre strip */}
      <div className="sticky top-0 bg-surface z-10 pt-4 pb-3 px-4 space-y-2 border-b border-surface-border">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder={type === 'series' ? 'Search series...' : 'Search movies...'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-dark pl-10"
          />
        </div>
        {/* Type selector */}
        <div className="flex gap-2 pb-1">
          <button
            onClick={() => setType('movies')}
            className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all duration-200 ${type === 'movies'
              ? 'bg-brand text-white border-brand'
              : 'bg-surface-card text-text-muted border-surface-border'
              }`}
          >
            Movies
          </button>
          <button
            onClick={() => setType('series')}
            className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all duration-200 ${type === 'series'
              ? 'bg-brand text-white border-brand'
              : 'bg-surface-card text-text-muted border-surface-border'
              }`}
          >
            Series
          </button>
        </div>
        {/* Genre pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {GENRES.map(g => (
            <button
              key={g.id ?? 'all'}
              onClick={() => setActiveGenre(g.id)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-200 ${activeGenre === g.id
                ? 'bg-brand text-white border-brand'
                : 'bg-surface-card text-text-muted border-surface-border'
                }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 pt-4">
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="aspect-[2/3] shimmer" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 shimmer rounded" />
                  <div className="h-3 w-1/2 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {movies.map(m => (
                <MovieCard
                  key={m.id} movie={m}
                  onAdd={handleAdd}
                  onClick={setDetailModalTarget}
                  isInList={watchlistIds.has(m.id)}
                  isVerified={verifiedIds.has(m.id)}
                  isSeries={type === 'series'}
                />
              ))}
            </div>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={loading}
              className="mt-4 w-full py-3 text-sm rounded-xl font-medium border border-surface-border bg-surface-card text-text-secondary hover:bg-surface-hover transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-surface-border border-t-brand rounded-full animate-spin" />
                  Loading...
                </span>
              ) : 'Load more'}
            </button>
          </>
        )}
      </div>

      {/* Season Picker Modal */}
      {seasonPickerTarget && (
        <SeasonPickerModal
          series={seasonPickerTarget}
          onAddSeason={handleAddSeason}
          onClose={() => setSeasonPickerTarget(null)}
          existingSeasons={existingSeasons}
        />
      )}

      {/* Detail Modal */}
      {detailModalTarget && (
        <MovieDetailsModal
          movie={detailModalTarget}
          isSeries={type === 'series'}
          onClose={() => setDetailModalTarget(null)}
        />
      )}
    </div>
  );
}
