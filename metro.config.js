const {getDefaultConfig} = require('expo/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  return config;
})();
