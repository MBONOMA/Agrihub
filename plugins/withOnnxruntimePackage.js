/**
 * Expo Config Plugin: withOnnxruntimePackage
 *
 * The official onnxruntime-react-native Expo plugin only adds the Gradle
 * dependency but does NOT register OnnxruntimePackage in MainApplication.kt.
 * This plugin patches MainApplication.kt to add the import and package
 * registration so the native module works at runtime.
 */
const { withMainApplication } = require('@expo/config-plugins');

const withOnnxruntimePackage = (config) => {
  return withMainApplication(config, (config) => {
    let contents = config.modResults.contents;

    // Add import if not already present
    const importLine = 'import ai.onnxruntime.reactnative.OnnxruntimePackage';
    if (!contents.includes(importLine)) {
      // Insert after the last import line
      const lastImportIndex = contents.lastIndexOf('import ');
      const endOfLastImport = contents.indexOf('\n', lastImportIndex);
      contents =
        contents.slice(0, endOfLastImport + 1) +
        importLine + '\n' +
        contents.slice(endOfLastImport + 1);
    }

    // Add OnnxruntimePackage() to getPackages() if not already present
    const packageLine = 'add(OnnxruntimePackage())';
    if (!contents.includes(packageLine)) {
      // Find the packages.apply block and add inside it
      const applyRegex = /\.packages\.apply\s*\{[^}]*\}/;
      const match = contents.match(applyRegex);
      if (match) {
        const original = match[0];
        // Insert before the closing brace
        const closingBrace = original.lastIndexOf('}');
        const patched =
          original.slice(0, closingBrace) +
          '\n              // Manually add OnnxruntimePackage (not autolinked by React Native CLI)\n' +
          '              add(OnnxruntimePackage())\n' +
          '            ' +
          original.slice(closingBrace);
        contents = contents.replace(original, patched);
      }
    }

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withOnnxruntimePackage;
