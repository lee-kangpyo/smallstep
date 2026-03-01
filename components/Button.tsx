import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "accent";
  size?: "small" | "medium" | "large";
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = "primary",
  size = "medium",
}) => {
  const buttonStyle = [
    styles.button,
    styles[size],
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyleCombined}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8, // 블루프린트 요구사항
  },

  // 크기별 스타일
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },

  // variant별 스타일
  primary: {
    backgroundColor: colors.deepMint, // 블루프린트 색상 적용
  },
  secondary: {
    backgroundColor: colors.lightBlue,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.deepMint,
  },
  accent: {
    backgroundColor: colors.coralPink, // 강조색 적용
  },

  disabled: {
    backgroundColor: colors.warmGray,
    opacity: 0.6,
  },

  // 텍스트 스타일
  text: {
    ...typography.button,
    textAlign: "center",
  },

  // variant별 텍스트 색상
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.primaryText,
  },
  outlineText: {
    color: colors.deepMint,
  },
  accentText: {
    color: colors.white,
  },

  // 크기별 텍스트 스타일
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  disabledText: {
    color: colors.secondaryText,
  },
});
