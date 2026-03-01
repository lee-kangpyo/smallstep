import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SmallStep } from "../data/mockData";
import { categoryColors } from "../data/mockData";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface TodayStepCardProps {
  step: SmallStep;
  isCompleted?: boolean;
}

export const TodayStepCard: React.FC<TodayStepCardProps> = ({
  step,
  isCompleted = false,
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
    <View style={[styles.container, isCompleted && styles.completed]}>
      {/* 완료 표시 */}
      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>✅ 완료</Text>
        </View>
      )}

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

      {/* 격려 메시지 */}
      <View style={styles.encouragementContainer}>
        <Text style={styles.encouragementText}>
          {isCompleted
            ? "오늘도 한 걸음 나아갔어요! 🌟"
            : "작은 걸음이 큰 변화를 만들어요 💪"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    margin: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    position: "relative",
  },
  completed: {
    backgroundColor: colors.lightBlue,
    borderColor: colors.success,
    borderWidth: 2,
  },
  completedBadge: {
    position: "absolute",
    top: -10,
    right: 20,
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  completedText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: 12,
    lineHeight: 28,
  },
  description: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: 20,
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: "flex-start",
  },
  timeLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  timeText: {
    ...typography.h2,
    color: colors.primaryText,
    fontWeight: "600",
  },
  difficultyContainer: {
    alignItems: "flex-end",
  },
  difficultyLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  encouragementContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.lightBlue,
    paddingTop: 16,
  },
  encouragementText: {
    ...typography.body,
    color: colors.deepMint,
    textAlign: "center",
    fontStyle: "italic",
  },
});
