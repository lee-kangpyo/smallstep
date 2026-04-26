import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Goal } from "../../types";
import { useGoalStore } from "../../stores/goalStore";

export const useGoalsViewModel = () => {
  const navigation = useNavigation();
  const { goals, isLoading, fetchGoals } = useGoalStore();

  const handleGoalPress = useCallback(
    (goalId: number) => {
      navigation.navigate("GoalDetail", { goalId });
    },
    [navigation]
  );

  const handleCreateGoal = useCallback(() => {
    navigation.navigate("CreateGoal");
  }, [navigation]);

  return {
    goals,
    isLoading,
    fetchGoals,
    handleGoalPress,
    handleCreateGoal,
  };
};
