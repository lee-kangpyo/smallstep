import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SmallStep } from "../data/mockData";
import { categoryColors } from "../data/mockData";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface StepCardProps {
  step: SmallStep;
  onPress?: () => void;
  selected?: boolean;
}

export const StepCard: React.FC<StepCardProps> = ({
  step,
  onPress,
  selected = false,
}) => {
  const categoryColor =
    categoryColors[step.category as keyof typeof categoryColors] ||
    colors.deepMint;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return colors.success;
      case "medium":
        return colors.warning;
      case "hard":
        return colors.error;
      default:
        return colors.secondaryText;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "쉬움";
      case "medium":
        return "보통";
      case "hard":
        return "어려움";
      default:
        return "보통";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 카테고리 배지 */}
      <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
        <Text style={styles.categoryText}>{step.category}</Text>
      </View>

      {/* 제목 */}
      <Text style={styles.title}>{step.title}</Text>

      {/* 설명 */}
      <Text style={styles.description}>{step.description}</Text>

      {/* 하단 정보 */}
      <View style={styles.footer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>예상 시간</Text>
          <Text style={styles.timeText}>{step.estimatedTime}</Text>
        </View>

        <View style={styles.difficultyContainer}>
          <Text style={styles.difficultyLabel}>난이도</Text>
          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(step.difficulty) },
            ]}
          >
            <Text style={styles.difficultyText}>
              {getDifficultyText(step.difficulty)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  selected: {
    borderColor: colors.deepMint,
    backgroundColor: colors.lightBlue,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  title: {
    ...typography.h2,
    color: colors.primaryText,
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeContainer: {
    alignItems: "flex-start",
  },
  timeLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  timeText: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "600",
  },
  difficultyContainer: {
    alignItems: "flex-end",
  },
  difficultyLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
});
