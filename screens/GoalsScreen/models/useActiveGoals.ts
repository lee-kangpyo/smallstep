import { useMemo, useCallback } from "react";
import { Alert } from "react-native";
import { useGoalStore } from "../../../stores";
import { Goal } from "../../../types";


/**
 * 진행 중인 목표를 가져오는 훅
 * GoalsScreen 전용 (나중에 다른 화면으로 옮기기 쉬움)
 */
export const useActiveGoals = () => {
  const { goals, getActiveGoals, deleteGoal } = useGoalStore();

  const activeGoals = useMemo(() => getActiveGoals(), [goals]);

  const handleGoalEdit = useCallback((goal: Goal) => {
    Alert.alert(goal.title, "수정하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "수정",
        onPress: () => {},
      },
    ]);
  }, []);

  const handleGoalDelete = useCallback(
    (goal: Goal) => {
      Alert.alert("목표 삭제", `${goal.title} 목표를 삭제하시겠습니까?`, [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            await deleteGoal(goal.id);
          },
        },
      ]);
    },
    [deleteGoal]
  );

  const handleGoalPress = useCallback(
    (goal: Goal) => {
      Alert.alert(goal.title, "클릭했습니다.", [
        { text: "취소", style: "cancel" },
        {
          text: "수정",
          onPress: () => {},
        },
      ]);
    },
    []
  );

  return {
    activeGoals,
    handleGoalPress,
    handleGoalEdit,
    handleGoalDelete,
  };
};

