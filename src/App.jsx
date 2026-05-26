import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { IS_APP } from '@/utils/platform';

// Layouts
import WebLayout from '@/components/layout/WebLayout';
import AppLayout from '@/components/layout/AppLayout';

// Shared pages
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

// Web-specific pages
import WebBrowsePage from '@/pages/web/WebBrowsePage';
import WebWatchlistPage from '@/pages/web/WebWatchlistPage';
import WebLeaderboardPage from '@/pages/web/WebLeaderboardPage';
import WebRoomsPage from '@/pages/web/WebRoomsPage';
import WebProfilePage from '@/pages/web/WebProfilePage';

// App-specific pages  (mobile-optimised)
import AppHomePage from '@/pages/app/AppHomePage';
import AppBrowsePage from '@/pages/app/AppBrowsePage';
import AppWatchlistPage from '@/pages/app/AppWatchlistPage';
import AppLeaderboardPage from '@/pages/app/AppLeaderboardPage';
import AppProfilePage from '@/pages/app/AppProfilePage';

// Shared
import AiSugPage from '@/pages/shared/AiSugPage';
import LandingPage from '@/pages/LandingPage';

function RequireAuth({ children }) {
  const token = useAuthStore(s => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRootWeb() {
  const token = useAuthStore(s => s.token);
  return token ? <Navigate to="/browse" replace /> : <LandingPage />;
}

function PublicRootApp() {
  const token = useAuthStore(s => s.token);
  return token ? <Navigate to="/home" replace /> : <LandingPage />;
}

export default function App() {
  const theme = useThemeStore(s => s.theme);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
      document.body.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  if (IS_APP) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PublicRootApp />} />
        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="home" element={<AppHomePage />} />
          <Route path="browse" element={<AppBrowsePage />} />
          <Route path="ai-sug" element={<AiSugPage />} />
          <Route path="watchlist" element={<AppWatchlistPage />} />
          <Route path="leaderboard" element={<AppLeaderboardPage />} />
          <Route path="profile" element={<AppProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<PublicRootWeb />} />
      <Route element={<RequireAuth><WebLayout /></RequireAuth>}>
        <Route path="browse" element={<WebBrowsePage />} />
        <Route path="watchlist" element={<WebWatchlistPage />} />
        <Route path="ai-sug" element={<AiSugPage />} />
        <Route path="leaderboard" element={<WebLeaderboardPage />} />
        <Route path="rooms" element={<WebRoomsPage />} />
        <Route path="profile" element={<WebProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
