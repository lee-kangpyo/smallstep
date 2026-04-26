import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useGoalStore } from "../../stores/goalStore";
import { useTaskStore } from "../../stores/taskStore";
import { smallstepApi } from "../../services/api";
import { ActivityLog } from "../../types";

export const useGoalDetailViewModel = (goalId: number) => {
  const navigation = useNavigation();
  const {
    currentGoal: goal,
    phases,
    isLoading,
    fetchGoalDetail,
    fetchPhases,
    setCurrentGoal,
  } = useGoalStore();

  const {
    currentWeeklyPlan: weeklyPlan,
    fetchCurrentWeeklyPlan,
    completeTask,
  } = useTaskStore();

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  const fetchActivityLogs = async (goalId: number) => {
    try {
      const response = await smallstepApi.fetchActivityLogs(goalId);
      if (response.success && response.data) {
        setActivityLogs(response.data);
      } else {
        setActivityLogs([]);
      }
    } catch (error) {
      console.error("활동 로그 로드 실패:", error);
      setActivityLogs([]);
    }
  };

  const handleCompleteTask = useCallback(
    async (taskId: number) => {
      await completeTask(taskId);
      await fetchCurrentWeeklyPlan(goalId);
      await fetchActivityLogs(goalId);
    },
    [completeTask, fetchCurrentWeeklyPlan, goalId, fetchActivityLogs]
  );

  const handleBack = useCallback(() => {
    setCurrentGoal(null);
    navigation.goBack();
  }, [navigation, setCurrentGoal]);

  return {
    goal,
    phases,
    weeklyPlan,
    activityLogs,
    isLoading,
    fetchGoalDetail,
    fetchPhases,
    fetchCurrentWeeklyPlan,
    fetchActivityLogs,
    handleCompleteTask,
    handleBack,
  };
};
