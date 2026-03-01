import { useMemo } from "react";
import { useGoalStore } from "../../../stores";
import { getStartOfWeek, isSameDay } from "../../../utils/dateUtils";
import { getTodayActivitiesFromGoals } from "../../../utils/scheduleUtils";

export interface WeekProgressStats {
  total: number;
  completed: number;
  missed: number;
  remaining: number;
  progress: number;
}

/**
 * 이번 주 진행 상황 통계를 계산하는 ViewModel
 */
export const useWeekProgressViewModel = () => {
  const { goals, getActiveGoals } = useGoalStore();

  // 이번 주 날짜 범위 계산
  const weekRange = useMemo(() => {
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { start: startOfWeek, end: endOfWeek, today };
  }, []);

  // 완료된 활동 Set 생성
  const completedActivities = useMemo(() => {
    const completedSet = new Set<string>();
    goals.forEach((goal) => {
      goal.progress.completedScheduleItems?.forEach((item) => {
        completedSet.add(item);
      });
    });
    return completedSet;
  }, [goals]);

  // 이번 주 모든 활동 수집
  const weekActivities = useMemo(() => {
    const activeGoals = getActiveGoals();
    const activities: Array<{
      activityKey: string;
      date: Date;
      isCompleted: boolean;
      isPast: boolean;
    }> = [];

    // 이번 주의 각 날짜별로 활동 수집
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekRange.start);
      date.setDate(weekRange.start.getDate() + i);
      const dayActivities = getTodayActivitiesFromGoals(activeGoals, date);

      dayActivities.forEach((activity) => {
        const activityKey = `${activity.goalId}-${activity.week}-${activity.day}`;
        const isCompleted = completedActivities.has(activityKey);
        const isPast = date < weekRange.today && !isSameDay(date, weekRange.today);

        activities.push({
          activityKey,
          date,
          isCompleted,
          isPast,
        });
      });
    }

    return activities;
  }, [goals, weekRange, completedActivities]);

  // 통계 계산
  const stats = useMemo(() => {
    const total = weekActivities.length;
    const completed = weekActivities.filter((a) => a.isCompleted).length;
    const missed = weekActivities.filter((a) => a.isPast && !a.isCompleted).length;
    const remaining = weekActivities.filter(
      (a) => !a.isPast && !a.isCompleted
    ).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      missed,
      remaining,
      progress,
    } as WeekProgressStats;
  }, [weekActivities]);

  return {
    stats,
    weekRange,
  };
};
