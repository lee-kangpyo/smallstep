import { Goal } from '../types';
import { ScheduleItem } from '../types';
import { Goal as GoalCardGoal } from '../types/goals';
import { getDayOfWeek, getWeekNumberFromStart } from './scheduleUtils';

/**
 * 오늘 할 일 데이터 변환
 * getTodayActivitiesFromGoals() 결과 → TodaysTasksSection용 Goal[]
 */
export const transformToTodaysTasks = (
  activities: Array<ScheduleItem & { goalId: string; goalTitle: string }>
): GoalCardGoal[] => {
  return activities.map(activity => ({
    id: activity.goalId,
    title: activity.goalTitle,
    nextAction: activity.title,
    totalSteps: 0,
    currentStep: 0,
    nextActionDate: new Date().toISOString().split('T')[0],
    category: '오늘',
    tasks: [],
  }));
};

/**
 * 다음 활동일 계산
 * 가장 최근의 미완료 활동일 찾기
 */
const getNextActionDateFromGoal = (goal: Goal): string => {
  if (!goal.roadmap?.schedule || !goal.startDate) {
    return new Date().toISOString().split('T')[0];
  }

  const completed = new Set(goal.progress.completedScheduleItems);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const incompleteItems = goal.roadmap.schedule
    .filter(item => !completed.has(`${goal.id}-${item.week}-${item.day}`))
    .map(item => {
      const week = getWeekNumberFromStart(goal.startDate, today);
      const day = getDayOfWeek(today);
      return {
        ...item,
        estimatedDate: week * 7 + day,
      };
    })
    .sort((a, b) => a.estimatedDate - b.estimatedDate);

  if (incompleteItems.length === 0) {
    return new Date().toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
};

/**
 * 다음 활동 제목 찾기
 */
const getNextActionFromGoal = (goal: Goal): string => {
  if (!goal.roadmap?.schedule || !goal.startDate) {
    return '다음 활동';
  }

  const completed = new Set(goal.progress.completedScheduleItems);
  const nextItem = goal.roadmap.schedule.find(
    item => !completed.has(`${goal.id}-${item.week}-${item.day}`)
  );

  return nextItem?.title || '다음 활동';
};

/**
 * 나의 플래너 목표 데이터 변환
 * 스토어 Goal[] → GoalCard용 Goal[]
 */
export const transformToPlannerGoals = (
  goals: Goal[]
): GoalCardGoal[] => {
  return goals.map(goal => ({
    id: goal.id,
    title: goal.title,
    totalSteps: goal.roadmap.schedule.length,
    currentStep: goal.progress.completedScheduleItems.length,
    nextAction: getNextActionFromGoal(goal),
    nextActionDate: getNextActionDateFromGoal(goal),
    category: '미분류',
    tasks: [],
  }));
};

/**
 * 전체 달성률 계산
 */
export const calculateOverallProgress = (goals: Goal[]): number => {
  if (goals.length === 0) return 0;
  const total = goals.reduce((sum, goal) => sum + goal.progress.totalProgress, 0);
  return Math.round(total / goals.length);
};

/**
 * Header 데이터 변환
 */
export const transformToHeaderData = (
  goals: Goal[],
  userData: any
): { name: string; activeGoalCount: number; overallProgress: number } => ({
  name: '홍길동',
  activeGoalCount: goals.length,
  overallProgress: calculateOverallProgress(goals),
});
