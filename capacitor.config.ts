import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'planit-app',
  webDir: 'www',
  server: {
    androidScheme: 'http',  // 👈 importante
    cleartext: true         // 👈 permite HTTP sin SSL
  }
};

export default config;
