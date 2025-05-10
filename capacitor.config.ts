
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.044accae62d44ca7adb240d866f47be2',
  appName: 'FastMed Emergency',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    Geolocation: {
      plist: ["This app requires geolocation permission to determine your location in case of emergency"],
    }
  },
  server: {
    url: "https://044accae-62d4-4ca7-adb2-40d866f47be2.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
};

export default config;
