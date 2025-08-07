import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Goal } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface GoalFilterProps {
  goals: Goal[];
  selectedGoalId: string | null;
  onGoalSelect: (goalId: string | null) => void;
}

export const GoalFilter: React.FC<GoalFilterProps> = ({
  goals,
  selectedGoalId,
  onGoalSelect,
}) => {
  const handleGoalPress = (goalId: string | null) => {
    onGoalSelect(goalId);
  };

  const getGoalProgress = (goal: Goal) => {
    const totalPhases = goal.roadmap.roadmap.length;
    const completedPhases = goal.progress.completedPhases.length;
    return totalPhases > 0
      ? Math.round((completedPhases / totalPhases) * 100)
      : 0;
  };

  const getGoalStatusColor = (goal: Goal) => {
    switch (goal.status) {
      case "active":
        return colors.deepMint;
      case "paused":
        return colors.coralPink;
      case "completed":
        return colors.success;
      default:
        return colors.secondaryText;
    }
  };

  const getGoalStatusText = (goal: Goal) => {
    switch (goal.status) {
      case "active":
        return "진행중";
      case "paused":
        return "일시정지";
      case "completed":
        return "완료";
      default:
        return "대기";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>목표별 필터</Text>
        <TouchableOpacity
          style={[
            styles.allGoalsButton,
            selectedGoalId === null && styles.activeFilterButton,
          ]}
          onPress={() => handleGoalPress(null)}
        >
          <Text
            style={[
              styles.allGoalsText,
              selectedGoalId === null && styles.activeFilterText,
            ]}
          >
            전체
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalFilterItem,
              selectedGoalId === goal.id && styles.activeFilterItem,
            ]}
            onPress={() => handleGoalPress(goal.id)}
            activeOpacity={0.7}
          >
            <View style={styles.goalHeader}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getGoalStatusColor(goal) },
                ]}
              />
              <Text
                style={[
                  styles.goalTitle,
                  selectedGoalId === goal.id && styles.activeGoalTitle,
                ]}
                numberOfLines={1}
              >
                {goal.title}
              </Text>
            </View>

            <View style={styles.goalProgress}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getGoalProgress(goal)}%`,
                      backgroundColor: getGoalStatusColor(goal),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{getGoalProgress(goal)}%</Text>
            </View>

            <Text style={styles.statusText}>{getGoalStatusText(goal)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
  },
  allGoalsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.lightBlue,
  },
  activeFilterButton: {
    backgroundColor: colors.deepMint,
  },
  allGoalsText: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  activeFilterText: {
    color: colors.white,
    fontWeight: "600",
  },
  scrollContainer: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingRight: 20,
  },
  goalFilterItem: {
    width: 160,
    padding: 16,
    backgroundColor: colors.lightMint,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeFilterItem: {
    borderColor: colors.deepMint,
    backgroundColor: colors.lightMint,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  goalTitle: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "600",
    flex: 1,
  },
  activeGoalTitle: {
    color: colors.deepMint,
  },
  goalProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.lightBlue,
    borderRadius: 2,
    marginRight: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "600",
  },
  statusText: {
    ...typography.caption,
    color: colors.secondaryText,
    textAlign: "center",
  },
});
