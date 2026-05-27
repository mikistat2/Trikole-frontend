import { useState, useEffect } from 'react';
import { moviesApi } from '@/api';
import { useWatchlistStore } from '@/store/watchlist.store';
import MovieCard from '@/components/common/MovieCard';
import MovieDetailsModal from '@/components/common/MovieDetailsModal';

export default function AiSugPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [detailModalTarget, setDetailModalTarget] = useState(null);

  const { items: watchlist, add, fetch: fetchWatchlist } = useWatchlistStore();

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const watchlistIds = new Set(watchlist.map(w => w.tmdb_id));
  const verifiedIds = new Set(watchlist.filter(w => w.status === 'verified').map(w => w.tmdb_id));

  async function handleRecommend(e) {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Force keyboard dismissal to reduce mobile layout shifts
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await moviesApi.recommend(prompt);
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full animate-fade-in">
      <div className="sticky top-0 z-20 bg-surface pt-4 sm:pt-6 pb-4 -mt-4 sm:-mt-6 mb-6">
        <div className="mb-4">
          <h1 className="page-header">AI Sug</h1>
          <p className="page-subtitle mt-1">
            Describe what you're in the mood for, and the AI will suggest 3 movies.
          </p>
        </div>

        <form onSubmit={handleRecommend} className="flex flex-col gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleRecommend(e);
              }
            }}
            placeholder="e.g. A mind-bending sci-fi movie about time travel..."
            className="input-dark p-4 text-base min-h-24 resize-none"
            disabled={loading}
            rows={4}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="btn-primary px-6 py-3 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Thinking...
              </>
            ) : (
              'Ask AI'
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm break-words ">
          {error}
        </div>
      )}

      {loading && !results.length && (
        <div className="py-12 flex flex-col items-center justify-center gap-4 animate-fade-in">
          <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Analyzing and parsing your request ...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">Top Picks</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {results.map(m => (
              <MovieCard
                key={m.id}
                movie={m}
                onAdd={handleAddMovie}
                onClick={setDetailModalTarget}
                isInList={watchlistIds.has(m.id)}
                isVerified={verifiedIds.has(m.id)}
                isSeries={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalTarget && (
        <MovieDetailsModal
          movie={detailModalTarget}
          isSeries={false}
          onClose={() => setDetailModalTarget(null)}
        />
      )}
    </div>
  );
}
