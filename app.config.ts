import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'AgriHub',
  slug: 'agrihub',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: false,
  scheme: 'agrihub',

  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#2E7D32',
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.agrihub.app',
    infoPlist: {
      NSCameraUsageDescription: 'AgriHub needs camera access to scan plant leaves for disease detection.',
      NSPhotoLibraryUsageDescription: 'AgriHub needs photo library access to analyze plant leaf images.',
    },
  },

  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E7D32',
    },
    package: 'com.agrihub.app',
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ],
  },

  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },

  // ✅ VERY IMPORTANT FOR ONNX MODELS
  assetBundlePatterns: ["**/*"],

  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission: 'AgriHub needs camera access to scan plant leaves for disease detection.',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'AgriHub needs photo library access to analyze plant leaf images.',
      },
    ],
    'onnxruntime-react-native',
    './plugins/withOnnxruntimePackage',
  ],

  experiments: {
    typedRoutes: true,
  },

  extra: {
    eas: {
      projectId: '5bc9d3e4-b7e8-4cd9-a7cd-ef331022ba8b',
    },
  },
});