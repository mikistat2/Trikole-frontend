import api from './client';

// ─── Auth ──────────────────────────────────────────────────
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  googleLogin: (credential) => api.post('/auth/google', { credential }),
};

// ─── Movies ───────────────────────────────────────────────
export const moviesApi = {
  getPopular: (page = 1) => api.get('/movies/popular', { params: { page } }),
  getTrending: () => api.get('/movies/trending'),
  search: (q, page = 1) => api.get('/movies/search', { params: { q, page } }),
  getByGenre: (genreId, page = 1) => api.get('/movies/genre', { params: { genreId, page } }),
  getDetail: (id) => api.get(`/movies/${id}`), recommend: (prompt) => api.post('/movies/recommend', { prompt }),
};

// ─── TV Series ────────────────────────────────────────────
export const seriesApi = {
  getPopular: (page = 1) => api.get('/series/popular', { params: { page } }),
  getTrending: () => api.get('/series/trending'),
  search: (q, page = 1) => api.get('/series/search', { params: { q, page } }),
  getByGenre: (genreId, page = 1) => api.get('/series/genre', { params: { genreId, page } }),
  getDetail: (id) => api.get(`/series/${id}`),
  getSeasonDetail: (id, seasonNumber) => api.get(`/series/${id}/season/${seasonNumber}`),
};

// ─── Watchlist ───────────────────────────────────────────
export const watchlistApi = {
  get: (date) => api.get('/watchlist', { params: { date } }),
  add: (movie) => api.post('/watchlist', movie),
  updateStatus: (id, status) => api.patch(`/watchlist/${id}/status`, { status }),
  remove: (id) => api.delete(`/watchlist/${id}`),
};

// ─── Verify ───────────────────────────────────────────────
export const verifyApi = {
  generate: (data) => api.post('/verify/generate', data),
  submit: (data) => api.post('/verify/submit', data),
};

// ─── Leaderboard ─────────────────────────────────────────
export const leaderboardApi = {
  getGlobal: () => api.get('/leaderboard/global'),
  getRoom: (roomId) => api.get(`/leaderboard/room/${roomId}`),
  getMyStats: () => api.get('/leaderboard/me'),
};

// ─── Rooms ────────────────────────────────────────────────
export const roomsApi = {
  getAll: () => api.get('/rooms'),
  create: (data) => api.post('/rooms', data),
  join: (code) => api.post('/rooms/join', { invite_code: code }),
  getDetail: (id) => api.get(`/rooms/${id}`),
  leave: (id) => api.delete(`/rooms/${id}/leave`),
};

// ─── Users ────────────────────────────────────────────────
export const usersApi = {
  getProfile: (username) => api.get(`/users/${username}`),
  getHistory: () => api.get('/users/history'),
};

// ─── Settings ──────────────────────────────────────────────
export const settingsApi = {
  get: (key) => api.get(`/settings/${key}`),
  update: (key, value) => api.put(`/settings/${key}`, { value }),
};
