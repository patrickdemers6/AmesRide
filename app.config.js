module.exports = {
  expo: {
    name: 'Ames Ride',
    slug: 'AmesRide',
    version: '1.3.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/66ed03a0-a25d-4e73-ba27-973d8ff7a2ae',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.demerstech.amesride',
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'Ames Ride uses your location to display your current location relative to busses and bus stops.',
      },
    },
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#C8102F',
      },
      package: 'com.demerstech.amesride',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    extra: {
      eas: {
        projectId: '66ed03a0-a25d-4e73-ba27-973d8ff7a2ae',
      },
    },
  },
};
