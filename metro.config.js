/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */



const { getDefaultConfig } = require('metro-config');
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();
  const { assetExts } = defaultConfig.resolver;
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      // Add bin to assetExts
      assetExts: [...assetExts, 'bin'],
    }
    
  };
})();


