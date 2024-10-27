import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "buzztrip",
  name: "BuzzTrip",
  scheme: "buzztrip",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/icons/logo_x48.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/icons/logo_x48.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.jacobsamo.buzztrip",
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_IOS_API_KEY!,
    },
  },
  android: {
    package: "com.jacobsamo.buzztrip",
    adaptiveIcon: {
      foregroundImage: "./src/assets/icons/logo_x48.png",
      backgroundColor: "#FFFFFF",
    },
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY,
      },
    },
  },
  // web: {
  //     bundler: 'metro',
  //     output: 'server',
  //   favicon: './src/assets/icons/logo_x48.png'
  // },
  experiments: {
    typedRoutes: true,
  },
  plugins: ["expo-font", "expo-router", "expo-secure-store"],
  extra: {
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  },
});
