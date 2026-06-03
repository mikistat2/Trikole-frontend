import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trickole.app',
  appName: 'Trickole',
  webDir: 'dist-app',
  overrideUserAgent: 'Mozilla/5.0 (Linux; Android 13; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
  server: {
    androidScheme: 'https',
    // For development: swap to your machine's local IP
    // url: 'http://192.168.x.x:5173',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#E85D24',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#E85D24',
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      clientId: '1070191817655-0onfqa0j24la2h1msjrfuiqhoa90lt9g.apps.googleusercontent.com',
      serverClientId: '1070191817655-0onfqa0j24la2h1msjrfuiqhoa90lt9g.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
