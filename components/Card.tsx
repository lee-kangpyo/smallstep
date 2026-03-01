import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors } from "../constants/colors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
  padding?: "small" | "medium" | "large";
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
  padding = "medium",
}) => {
  const cardStyle = [
    styles.card,
    styles[variant],
    styles[
      `padding${
        padding.charAt(0).toUpperCase() + padding.slice(1)
      }` as keyof typeof styles
    ],
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.sandBeige, // 블루프린트 색상 적용
    borderRadius: 16, // 블루프린트 요구사항
    alignItems: "stretch",
  },

  // variant별 스타일
  default: {
    // 기본 스타일
  },

  elevated: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  outlined: {
    borderWidth: 1,
    borderColor: colors.deepMint,
  },

  // 패딩별 스타일
  paddingSmall: {
    padding: 12,
  },

  paddingMedium: {
    padding: 16,
  },

  paddingLarge: {
    padding: 20,
  },
});
