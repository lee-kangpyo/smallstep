import React, { useState, useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import { useGoalStore } from "../../stores/goalStore";
import { WeeklyStats, Phase } from "../../types";
import { smallstepApi } from "../../services/api";

export const useStatsViewModel = () => {
  const { stats, streakInfo, isLoading: userLoading, fetchStats, fetchStreakInfo } = useUserStore();
  const { goals, fetchGoals } = useGoalStore();

  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [goalPhases, setGoalPhases] = useState<Record<number, Phase[]>>({});
  const [isWeeklyLoading, setIsWeeklyLoading] = useState(false);

  const fetchWeeklyStats = async () => {
    setIsWeeklyLoading(true);
    try {
      const userId = 1; // MVP용 고정 ID
      const response = await smallstepApi.fetchWeeklyStats(userId);
      if (response.success && response.data) {
        setWeeklyStats(response.data);
      } else {
        setWeeklyStats([]);
      }
    } catch (error) {
      console.error("주간 통계 로드 실패:", error);
    } finally {
      setIsWeeklyLoading(false);
    }
  };

  const fetchAllGoalPhases = async () => {
    const phasesMap: Record<number, Phase[]> = {};
    for (const goal of goals) {
      try {
        const response = await smallstepApi.fetchPhases(goal.id);
        if (response.success && response.data) {
          phasesMap[goal.id] = response.data;
        }
      } catch (error) {
        console.error(`목표 ${goal.id}의 Phase 로드 실패:`, error);
      }
    }
    setGoalPhases(phasesMap);
  };

  useEffect(() => {
    if (goals.length > 0) {
      fetchAllGoalPhases();
    }
  }, [goals]);

  return {
    stats,
    streakInfo,
    weeklyStats,
    goals,
    goalPhases,
    isLoading: userLoading || isWeeklyLoading,
    fetchStats,
    fetchStreakInfo,
    fetchWeeklyStats,
    fetchGoals,
  };
};
