import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GoalCard } from "../../../components/GoalCard";
import { Goal } from "../../../types";
import { colors } from "../../../constants/colors";
import { typography } from "../../../constants/typography";

interface ActiveGoalsListProps {
  activeGoals: Goal[];
  onGoalPress: (goal: Goal) => void;
  onGoalEdit: (goal: Goal) => void;
  onGoalDelete: (goal: Goal) => void;
}

export const ActiveGoalsList: React.FC<ActiveGoalsListProps> = ({
  activeGoals,
  onGoalPress,
  onGoalEdit,
  onGoalDelete,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>진행 중인 목표</Text>
        <Text style={styles.goalCount}>{activeGoals.length}개</Text>
      </View>

      {activeGoals.length === 0 ? (
        <View style={styles.emptyGoals}>
          <Ionicons
            name="flag-outline"
            size={48}
            color={colors.secondaryText}
          />
          <Text style={styles.emptyGoalsText}>목표가 없습니다</Text>
          <Text style={styles.emptyGoalsDescription}>
            첫 번째 목표를 추가해보세요!
          </Text>
        </View>
      ) : (
        activeGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onPress={() => onGoalPress(goal)}
            onEdit={() => onGoalEdit(goal)}
            onDelete={() => onGoalDelete(goal)}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
  },
  goalCount: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  emptyGoals: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyGoalsText: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyGoalsDescription: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
  },
});

