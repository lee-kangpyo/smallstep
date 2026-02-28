module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-dotenv 플러그인 제거 - Expo의 EXPO_PUBLIC_ 방식 사용
  };
};
