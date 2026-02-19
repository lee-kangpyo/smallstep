const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  watcher: {
    include: [
      '**/src/**',
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
