import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { OnboardingSlide as OnboardingSlideType } from "../data/mockData";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
}

const { width } = Dimensions.get("window");

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide }) => {
  return (
    <View style={styles.container}>
      {/* 일러스트레이션 영역 (나중에 이미지 추가) */}
      <View style={styles.illustrationContainer}>
        <View style={styles.placeholderIllustration}>
          <Text style={styles.placeholderText}>🎯</Text>
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
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  placeholderIllustration: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  placeholderText: {
    fontSize: 80,
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
