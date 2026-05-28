import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function normalizeProxyTarget(rawUrl) {
  const trimmed = String(rawUrl || '').trim();
  if (!trimmed) return 'http://localhost:5000';

  const urlMatch = trimmed.match(/https?:\/\/[^\s'"]+/i);
  const candidate = urlMatch ? urlMatch[0] : trimmed;

  return candidate.replace(/\/api\/?$/, '').replace(/\/$/, '');
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isApp = mode === 'app';

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    define: {
      // IS_APP flag used throughout the codebase to swap UI/behavior
      __IS_APP__: JSON.stringify(isApp),
    },
    build: {
      outDir: isApp ? 'dist-app' : 'dist',
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: normalizeProxyTarget(env.VITE_API_URL), changeOrigin: true },
      },
    },
  };
});
