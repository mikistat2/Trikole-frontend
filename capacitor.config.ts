import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trickole.app',
  appName: 'Trickole',
  webDir: 'dist-app',
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
  },
};

export default config;
