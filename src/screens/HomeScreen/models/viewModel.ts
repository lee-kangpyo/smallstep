import { useState, useEffect, useMemo, useCallback } from "react";
import { Goal, ScheduleItem } from "../../../types";
import { useGoalStore } from "../../../stores";
import { getTodayActivitiesFromGoals } from "../../../utils/scheduleUtils";
import { useWeekProgressViewModel } from "./useWeekProgressViewModel";

/**
 * HomeScreen용 ViewModel
 * 오늘의 활동 중심으로 단순화
 */
export const useHomeViewModel = () => {
  // Zustand Store
  const {
    goals,
    loadGoals,
    updateGoal,
    getActiveGoals,
  } = useGoalStore();

  // 로컬 상태
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<
    (ScheduleItem & { goalId: string; goalTitle: string }) | null
  >(null);
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(
    new Set()
  );

  // 목표 로드
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // 완료된 활동 초기화 (goals에서 로드)
  useEffect(() => {
    const completedSet = new Set<string>();
    goals.forEach((goal) => {
      goal.progress.completedScheduleItems?.forEach((item) => {
        completedSet.add(item);
      });
    });
    setCompletedActivities(completedSet);
  }, [goals]);

  // 오늘 날짜
  const today = useMemo(() => new Date(), []);

  // 이번 주 진행 상황 통계
  const { stats: weekProgressStats } = useWeekProgressViewModel();

  // 오늘의 활동
  const todayActivities = useMemo(
    () => getTodayActivitiesFromGoals(getActiveGoals(), today),
    [goals, today]
  );

  // 헬퍼 함수
  const isActivityCompleted = useCallback(
    (activityKey: string) => {
      return completedActivities.has(activityKey);
    },
    [completedActivities]
  );

  const getDateTitle = useCallback((date: Date) => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = dayNames[date.getDay()];
    const month = date.getMonth() + 1;
    const dayNumber = date.getDate();
    return `${month}월 ${dayNumber}일 ${dayName}요일`;
  }, []);

  // 핸들러 함수
  const handleActivityPress = useCallback(
    (activity: ScheduleItem & { goalId: string; goalTitle: string }) => {
      setSelectedActivity(activity);
      setActivityModalVisible(true);
    },
    []
  );

  const handleActivityComplete = useCallback(
    async (completed: boolean) => {
      if (!selectedActivity) return;

      const activityKey = `${selectedActivity.goalId}-${selectedActivity.week}-${selectedActivity.day}`;

      // 로컬 상태 업데이트 (UI 반영)
      setCompletedActivities((prev) => {
        const newSet = new Set(prev);
        if (completed) {
          newSet.add(activityKey);
        } else {
          newSet.delete(activityKey);
        }
        return newSet;
      });

      // goal.progress.completedScheduleItems에 저장 (MMKV)
      const goal = goals.find((g) => g.id === selectedActivity.goalId);
      if (goal) {
        const currentCompleted = goal.progress.completedScheduleItems || [];
        const updatedCompleted = completed
          ? [...currentCompleted, activityKey].filter(
              (item, index, self) => self.indexOf(item) === index
            ) // 중복 제거
          : currentCompleted.filter((item) => item !== activityKey);

        await updateGoal(goal.id, {
          progress: {
            ...goal.progress,
            completedScheduleItems: updatedCompleted,
          },
        });
      }
    },
    [selectedActivity, goals, updateGoal]
  );

  const handleActivityModalClose = useCallback(() => {
    setActivityModalVisible(false);
    setSelectedActivity(null);
  }, []);

  return {
    // 상태
    activityModalVisible,
    selectedActivity,
    today,

    // 계산된 값
    todayActivities,
    weekProgressStats,

    // 핸들러
    handleActivityPress,
    handleActivityComplete,
    handleActivityModalClose,

    // 헬퍼
    isActivityCompleted,
    getDateTitle,
  };
};
