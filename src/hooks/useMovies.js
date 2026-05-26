import { useState, useEffect, useCallback } from 'react';
import { moviesApi } from '@/api';

export function useMovies({ query = '', genreId = null, page = 1 } = {}) {
  const [movies, setMovies]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (query)        res = await moviesApi.search(query, page);
      else if (genreId) res = await moviesApi.getByGenre(genreId, page);
      else              res = await moviesApi.getPopular(page);
      setMovies(prev => page === 1 ? res.data.results : [...prev, ...res.data.results]);
      setTotalPages(res.data.total_pages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [query, genreId, page]);

  useEffect(() => { load(); }, [load]);
  return { movies, loading, error, totalPages, reload: load };
}
