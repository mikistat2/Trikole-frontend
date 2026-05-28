import { useState, useEffect } from 'react';
import { moviesApi, seriesApi } from '@/api';

const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

export default function MovieDetailsModal({ movie, onClose, isSeries = false }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      if (!movie?.id) return;
      try {
        setLoading(true);
        const api = isSeries ? seriesApi : moviesApi;
        const res = await api.getDetail(movie.id);
        setDetails(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load details.');
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [movie, isSeries]);

  if (!movie) return null;

  const title = details?.title || details?.name || movie.title || movie.name || '';
  const year = (details?.release_date || details?.first_air_date || movie.release_date || movie.first_air_date)?.slice(0, 4) || '';
  const rating = details?.vote_average?.toFixed(1) || movie.vote_average?.toFixed(1) || '';
  const overview = details?.overview || movie.overview || 'No description available.';
  
  const posterUrl = details?.poster_path || movie.poster_path
    ? `${IMG_BASE}/w500${details?.poster_path || movie.poster_path}`
    : null;
    
  const backdropUrl = details?.backdrop_path || movie.backdrop_path
    ? `${IMG_BASE}/w1280${details?.backdrop_path || movie.backdrop_path}`
    : null;

  const trailer = details?.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  const cast = details?.credits?.cast?.slice(0, 5) || [];
  
  const runtime = details?.runtime || (details?.episode_run_time && details?.episode_run_time[0]) || null;
  const genres = details?.genres || [];

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl z-50 bg-surface-raised rounded-2xl border border-surface-border overflow-hidden animate-slide-up flex flex-col sm:max-h-[85vh]">
        
        {/* Header/Backdrop or Trailer */}
        {trailer ? (
          <div className="relative aspect-video w-full shrink-0 bg-black">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${trailer.key}`} 
              title="Trailer"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10 backdrop-blur-md"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="relative h-48 sm:h-64 shrink-0 bg-surface-card">
            {backdropUrl ? (
              <img src={backdropUrl} alt={title} className="w-full h-full object-cover opacity-50" />
            ) : (
              <div className="w-full h-full bg-surface-subtle" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-surface-raised via-surface-raised/50 to-transparent" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10 backdrop-blur-md"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 overflow-y-auto no-scrollbar relative pb-6 ${trailer ? 'mt-0 pt-6' : '-mt-20 sm:-mt-24'}`}>
          <div className="px-4 sm:px-6 flex flex-col sm:flex-row gap-6">
            
            {/* Poster */}
            <div className="shrink-0 w-32 sm:w-48 mx-auto sm:mx-0 shadow-xl rounded-xl overflow-hidden border-2 border-surface-border bg-surface-card aspect-[2/3]">
              {posterUrl ? (
                <img src={posterUrl} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">No Poster</div>
              )}
            </div>

            {/* Info */}
            <div className={`flex-1 flex flex-col gap-4 ${trailer ? 'pt-0' : 'pt-2 sm:pt-24'}`}>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight">
                  {title} <span className="text-text-muted font-normal text-lg sm:text-xl">({year})</span>
                </h2>
                {details?.tagline && (
                  <p className="text-text-muted italic text-sm mt-1">{details.tagline}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                {rating && (
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {rating}
                  </div>
                )}
                {runtime && (
                  <div className="bg-surface-border px-2 py-1 rounded-md text-text-secondary">
                    {Math.floor(runtime / 60)}h {runtime % 60}m
                  </div>
                )}
                {isSeries && details?.number_of_seasons && (
                  <div className="bg-brand/20 text-brand px-2 py-1 rounded-md">
                    {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}
                  </div>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {genres.map(g => (
                    <span key={g.id} className="text-xs px-2.5 py-1 rounded-full bg-surface-subtle text-text-secondary border border-surface-border">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="mt-8 flex justify-center text-brand">
              <span className="w-6 h-6 border-2 border-surface-border border-t-brand rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="mt-8 text-red-400 text-sm text-center">{error}</div>
          ) : (
            <div className="mt-8 space-y-6">
              {/* Overview */}
              <div className="px-4 sm:px-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Overview</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {overview}
                </p>
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div className="px-4 sm:px-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">Top Cast</h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {cast.map(person => (
                      <div key={person.id} className="w-20 shrink-0 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-surface-subtle overflow-hidden mb-2">
                          {person.profile_path ? (
                            <img src={`${IMG_BASE}/w185${person.profile_path}`} alt={person.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">N/A</div>
                          )}
                        </div>
                        <div className="text-xs font-medium text-text-primary truncate">{person.name}</div>
                        <div className="text-[10px] text-text-muted truncate">{person.character}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
