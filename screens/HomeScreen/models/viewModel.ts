import { useState, useEffect, useMemo, useCallback } from "react";
import { Goal, ScheduleItem } from "../../../types";
import { useGoalStore } from "../../../stores";
import { useUserStore } from "../../../stores";
import { getTodayActivitiesFromGoals } from "../../../utils/scheduleUtils";
import { useWeekProgressViewModel } from "./useWeekProgressViewModel";
import { transformToTodaysTasks, transformToPlannerGoals, transformToHeaderData, calculateOverallProgress } from "../../../utils/home";

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

  const { userData } = useUserStore();

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
    () => {
      const activeGoals = getActiveGoals();
      console.log('[HomeScreen] getActiveGoals 결과:', activeGoals.map(g => ({
        id: g.id,
        title: g.title,
        startDate: g.startDate,
        hasRoadmap: !!g.roadmap,
        hasSchedule: !!g.roadmap?.schedule,
        scheduleLength: g.roadmap?.schedule?.length,
        weeklyPattern: g.weeklyPattern,
      })));
      const activities = getTodayActivitiesFromGoals(activeGoals, today);
      console.log('[HomeScreen] getTodayActivitiesFromGoals 결과:', activities);
      return activities;
    },
    [goals, today]
  );

  // 오늘 할 일 데이터 변환
  const todaysTasks = useMemo(
    () => transformToTodaysTasks(todayActivities),
    [todayActivities]
  );

  // 나의 플래너 목표 데이터 변환
  const plannerGoals = useMemo(
    () => transformToPlannerGoals(goals),
    [goals]
  );

  // Header 데이터 변환
  const headerData = useMemo(
    () => transformToHeaderData(goals, userData),
    [goals, userData]
  );

  // 데이터 디버깅 (goals가 로드될 때만 실행)
  useEffect(() => {
    if (goals.length > 0) {
      console.log('[HomeScreen] Goals 데이터 확인:', goals.map(g => ({
        id: g.id,
        title: g.title,
        totalProgress: g.progress.totalProgress,
        completedScheduleItems: g.progress.completedScheduleItems?.length,
        scheduleLength: g.roadmap?.schedule?.length,
      })));
      console.log('[HomeScreen] Header 계산:', {
        goalsCount: goals.length,
        total: goals.reduce((sum, g) => sum + g.progress.totalProgress, 0),
        average: calculateOverallProgress(goals),
      });
    }
  }, [goals]);

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
    todaysTasks,
    plannerGoals,
    headerData,

    // 핸들러
    handleActivityPress,
    handleActivityComplete,
    handleActivityModalClose,

    // 헬퍼
    isActivityCompleted,
    getDateTitle,
  };
};
