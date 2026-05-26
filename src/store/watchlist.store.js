import { create } from 'zustand';
import { watchlistApi } from '@/api';

export const useWatchlistStore = create((set, get) => ({
  items:   [],
  loading: false,
  error:   null,

  fetch: async (date) => {
    set({ loading: true, error: null });
    try {
      const res = await watchlistApi.get(date);
      set({ items: res.data, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  add: async (movie) => {
    const res = await watchlistApi.add(movie);
    set(s => ({ items: [...s.items, res.data] }));
  },

  updateStatus: async (id, status) => {
    const res = await watchlistApi.updateStatus(id, status);
    set(s => ({
      items: s.items.map(i => i.id === id ? res.data : i),
    }));
  },

  remove: async (id) => {
    await watchlistApi.remove(id);
    set(s => ({ items: s.items.filter(i => i.id !== id) }));
  },

  /**
   * Mark a watchlist entry as verified.
   * For series, matches on both tmdb_id AND season_number.
   */
  markVerified: (tmdbId, seasonNumber = null) => {
    set(s => ({
      items: s.items.map(i => {
        if (i.tmdb_id !== tmdbId) return i;
        // For series entries, also match on season_number
        if (seasonNumber != null && i.season_number !== seasonNumber) return i;
        return { ...i, status: 'verified' };
      }),
    }));
  },
}));
