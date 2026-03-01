import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

export const TestScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>바텀 탭 테스트</Text>
      <Text style={styles.subtitle}>하단에 탭이 보이나요?</Text>
      <View style={styles.testBox}>
        <Text style={styles.testText}>이 박스 아래에 탭이 있어야 합니다</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: 20,
  },
  subtitle: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 50,
  },
  testBox: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testText: {
    ...typography.body,
    color: colors.primaryText,
    textAlign: "center",
  },
});
