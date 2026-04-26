import { useState, useEffect, useCallback } from "react";
import { Task, User, StatsOverview, StreakInfo } from "../../types";
import { useUserStore } from "../../stores/userStore";
import { useTaskStore } from "../../stores/taskStore";

export const useHomeViewModel = () => {
  const { user, stats, streakInfo, fetchUser, fetchStats, fetchStreakInfo } = useUserStore();
  const { todayTasks, fetchTodayTasks, completeTask } = useTaskStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteTask = useCallback(
    async (taskId: number) => {
      await completeTask(taskId);
      // 완료 후 데이터 새로고침
      await fetchTodayTasks();
      await fetchStats();
      await fetchStreakInfo();
    },
    [completeTask, fetchTodayTasks, fetchStats, fetchStreakInfo]
  );

  return {
    user,
    stats,
    todayTasks,
    streakInfo,
    isLoading,
    fetchUser,
    fetchStats,
    fetchTodayTasks,
    fetchStreakInfo,
    handleCompleteTask,
  };
};
