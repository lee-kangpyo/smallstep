import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { OnboardingSlide as OnboardingSlideType } from "../data/mockData";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

// 온보딩 이미지 import
const onboardingImages = {
  1: require("../../assets/images/onboarding/onboarding-1.png"),
  2: require("../../assets/images/onboarding/onboarding-2.png"),
  3: require("../../assets/images/onboarding/onboarding-3.png"),
};

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
}

const { width } = Dimensions.get("window");

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide }) => {
  return (
    <View style={styles.container}>
      {/* 일러스트레이션 영역 */}
      <View style={styles.illustrationContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={onboardingImages[slide.id as keyof typeof onboardingImages]}
            style={styles.illustrationImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* 텍스트 콘텐츠 영역 */}
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },
  imageWrapper: {
    width: width * 0.75,
    height: width * 0.75, // 원형
    maxWidth: 360,
    maxHeight: 360,
    borderRadius: 180, // 완전한 원형
    overflow: "hidden", // 둥근 모서리 적용을 위해
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  subtitle: {
    ...typography.caption,
    color: colors.deepMint,
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "600",
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 32,
  },
  description: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
