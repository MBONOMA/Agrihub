const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add ONNX model extensions for ML models
config.resolver.assetExts.push('onnx');
config.resolver.assetExts.push('onnx.data');

// Add tflite to asset extensions for ML models
config.resolver.assetExts.push('tflite');

// Add bin extension for any binary assets
config.resolver.assetExts.push('bin');

config.resolver.unstable_allowRequireContext = true;

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
