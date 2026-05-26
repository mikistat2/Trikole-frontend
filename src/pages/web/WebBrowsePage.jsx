import { useState, useEffect, useCallback } from 'react';
import { moviesApi, seriesApi } from '@/api';
import { useWatchlistStore } from '@/store/watchlist.store';
import MovieCard from '@/components/common/MovieCard';
import SeasonPickerModal from '@/components/common/SeasonPickerModal';
import MovieDetailsModal from '@/components/common/MovieDetailsModal';

const GENRES = [
  { id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' }, { id: 878, name: 'Sci-Fi' }, { id: 53, name: 'Thriller' },
  { id: 10749, name: 'Romance' }, { id: 16, name: 'Animation' }, { id: 99, name: 'Documentary' },
];

export default function WebBrowsePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState(null);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('movies');
  const [filterOpen, setFilterOpen] = useState(false);
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
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [query, activeGenre, page, type]);

  useEffect(() => { setPage(1); }, [query, activeGenre, type]);
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

  // Called from SeasonPickerModal for each season
  async function handleAddSeason(seasonData) {
    await add(seasonData);
  }

  const watchlistIds = new Set(watchlist.map(w => w.tmdb_id));
  const verifiedIds = new Set(watchlist.filter(w => w.status === 'verified').map(w => w.tmdb_id));

  // For series, build a set of season numbers already in the list for the current picker target
  const existingSeasons = seasonPickerTarget
    ? new Set(
      watchlist
        .filter(w => w.tmdb_id === seasonPickerTarget.id && w.season_number != null)
        .map(w => w.season_number)
    )
    : new Set();

  /* Filter sidebar content (reused for mobile sheet + desktop aside) */
  const filterContent = (
    <>
      <div className="mb-6">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Type</p>
        <div className="space-y-1">
          {['movies', 'series'].map(t => (
            <button
              key={t}
              onClick={() => { setType(t); setFilterOpen(false); }}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${type === t
                ? 'bg-brand/10 text-brand font-medium border border-brand/15'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                }`}
            >
              {t === 'movies' ? 'Movies' : 'Series'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Genre</p>
      <div className="space-y-0.5">
        <button
          onClick={() => { setActiveGenre(null); setFilterOpen(false); }}
          className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${!activeGenre
            ? 'bg-brand/10 text-brand font-medium border border-brand/15'
            : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
            }`}
        >
          All
        </button>
        {GENRES.map(g => (
          <button
            key={g.id}
            onClick={() => { setActiveGenre(activeGenre === g.id ? null : g.id); setFilterOpen(false); }}
            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${activeGenre === g.id
              ? 'bg-brand/10 text-brand font-medium border border-brand/15'
              : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
          >
            {g.name}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="flex h-full">
      {/* Desktop filter sidebar */}
      <aside className="hidden lg:block w-52 shrink-0 border-r border-surface-border p-4 overflow-y-auto no-scrollbar">
        {filterContent}
      </aside>

      {/* Mobile filter bottom sheet */}
      {filterOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setFilterOpen(false)} />
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-raised rounded-t-2xl border-t border-surface-border p-5 pb-8 max-h-[70vh] overflow-y-auto animate-slide-up safe-bottom">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Filters</h3>
              <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {filterContent}
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        {/* Search + filter toggle */}
        <div className="flex gap-2 mb-6 max-w-lg">
          <div className="relative flex-1">
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
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden btn-secondary flex items-center gap-2 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
            </svg>
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* Active filter chips (mobile) */}
        <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
          <span className="chip-brand">{type === 'movies' ? 'Movies' : 'Series'}</span>
          {activeGenre && (
            <span className="chip-brand">
              {GENRES.find(g => g.id === activeGenre)?.name}
              <button onClick={() => setActiveGenre(null)} className="ml-1.5 text-brand/60 hover:text-brand">✕</button>
            </span>
          )}
        </div>

        {/* Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {movies.map(m => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  onAdd={handleAdd}
                  onClick={setDetailModalTarget}
                  isInList={watchlistIds.has(m.id)}
                  isVerified={verifiedIds.has(m.id)}
                  isSeries={type === 'series'}
                />
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={loading}
                className="btn-secondary px-8"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-surface-border border-t-brand rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : 'Load more'}
              </button>
            </div>
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
