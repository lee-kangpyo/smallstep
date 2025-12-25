export default {
  expo: {
    name: "SmallStep",
    slug: "smallstep",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    plugins: [
      "expo-font"
    ],
    extra: {
      eas: {
        projectId: "14700a6d-4932-48c6-a9d0-e072e403aa0e"
      }
    },
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.akmz.smallstep",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  },
};
