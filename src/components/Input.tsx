import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from "react-native";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  variant?: "default" | "outlined";
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  error,
  style,
  inputStyle,
  variant = "default",
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = [
    styles.container,
    styles[variant],
    isFocused && styles.focused,
    error && styles.error,
    style,
  ];

  const inputContainerStyle = [
    styles.inputContainer,
    styles[`${variant}Input`],
    isFocused && styles.focusedInput,
    error && styles.errorInput,
  ];

  const inputTextStyle = [styles.input, inputStyle];

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={inputContainerStyle}>
        <TextInput
          style={inputTextStyle}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    ...typography.body,
    color: colors.primaryText,
    marginBottom: 8,
    fontWeight: "500",
  },

  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    backgroundColor: colors.warmGray, // 블루프린트 색상 적용
  },

  input: {
    ...typography.body,
    color: colors.primaryText,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },

  // variant별 스타일
  default: {
    // 기본 스타일
  },

  outlined: {
    backgroundColor: colors.transparent,
    borderColor: colors.deepMint,
  },

  defaultInput: {
    // 기본 입력 스타일
  },

  outlinedInput: {
    backgroundColor: colors.transparent,
  },

  // 포커스 상태
  focused: {
    // 컨테이너 포커스 스타일
  },

  focusedInput: {
    borderColor: colors.deepMint, // 블루프린트 색상 적용
    backgroundColor: colors.white,
  },

  // 에러 상태
  error: {
    // 컨테이너 에러 스타일
  },

  errorInput: {
    borderColor: colors.error,
    backgroundColor: colors.white,
  },

  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 4,
  },
});
