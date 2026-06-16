import { useState, useEffect } from 'react';
import { IS_APP } from '@/utils/platform';

// ── Bump this every time you ship a new APK ──────────────────────────────────
export const CURRENT_VERSION = '1.0.0';

// Compares "1.2.3" style semver strings. Returns true if remote > local.
function isNewer(remote, local) {
  const parse = (v) => String(v).split('.').map(Number);
  const [rMaj, rMin, rPat] = parse(remote);
  const [lMaj, lMin, lPat] = parse(local);
  if (rMaj !== lMaj) return rMaj > lMaj;
  if (rMin !== lMin) return rMin > lMin;
  return rPat > lPat;
}

/**
 * Fetches /version.json from the server and compares it to CURRENT_VERSION.
 * Only runs inside the Capacitor Android build (IS_APP === true).
 *
 * Returns: { updateAvailable, latestVersion, apkUrl, releaseNotes, dismiss }
 */
export function useAppUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion]     = useState('');
  const [apkUrl, setApkUrl]                   = useState('/Trickole.apk');
  const [releaseNotes, setReleaseNotes]       = useState('');

  useEffect(() => {
    if (!IS_APP) return; // only check inside the Android app

    let cancelled = false;

    async function check() {
      try {
        // cache-busting param so Capacitor's WebView doesn't serve stale JSON
        const res = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;

        if (data.version && isNewer(data.version, CURRENT_VERSION)) {
          setLatestVersion(data.version);
          setApkUrl(data.apkUrl || '/Trickole.apk');
          setReleaseNotes(data.releaseNotes || '');
          setUpdateAvailable(true);
        }
      } catch {
        // Network unavailable – silently ignore
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  const dismiss = () => setUpdateAvailable(false);

  return { updateAvailable, latestVersion, apkUrl, releaseNotes, dismiss };
}
