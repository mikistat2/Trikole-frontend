import axios from 'axios';
import { useAuthStore } from '@/store/auth.store';

function normalizeApiBaseUrl(rawUrl) {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) return '/api';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api';
  }

  return trimmed.replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api';
}

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  timeout: 15000,
});

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error('VITE_API_URL is not set. Production login requests will fall back to /api on the Vercel origin and fail unless the backend is co-hosted.');
}

// Attach JWT on every request
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  }
);

export default api;
