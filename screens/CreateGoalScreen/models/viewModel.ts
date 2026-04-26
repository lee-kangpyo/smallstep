import { useState, useCallback } from "react";
import { useGoalStore } from "../../stores/goalStore";

export const useCreateGoalViewModel = () => {
  const { createGoal: createGoalAction, isLoading, error, clearError } = useGoalStore();

  const createGoal = useCallback(
    async (data: {
      title: string;
      description?: string;
      daily_minutes?: number;
      deadline_date?: string;
      current_level?: string;
    }) => {
      await createGoalAction(data);
    },
    [createGoalAction]
  );

  return {
    createGoal,
    isLoading,
    error,
    clearError,
  };
};
