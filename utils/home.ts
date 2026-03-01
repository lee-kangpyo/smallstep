import { Goal } from '../types';
import { ScheduleItem } from '../types';
import { Goal as GoalCardGoal } from '../types/goals';
import { getDayOfWeek, getWeekNumberFromStart, getDateFromWeekAndDay } from './scheduleUtils';

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = getDayOfWeek(today);
  const currentWeek = getWeekNumberFromStart(goal.startDate, today);

  // weeklyPattern이 있으면 선택된 요일 기준으로 계산
  if (goal.weeklyPattern && goal.weeklyPattern.selectedDays) {
    const { selectedDays } = goal.weeklyPattern;

    // 오늘 이후 가장 가까운 선택된 요일 찾기
    const nextDay = selectedDays.find(day => day >= currentDay);

    if (nextDay) {
      // 같은 주에 있는 요일
      const date = getDateFromWeekAndDay(goal.startDate, currentWeek, nextDay);
      return date.toISOString().split('T')[0];
    } else {
      // 다음 주 첫 번째 요일
      const firstDay = selectedDays[0];
      const date = getDateFromWeekAndDay(goal.startDate, currentWeek + 1, firstDay);
      return date.toISOString().split('T')[0];
    }
  }

  // weeklyPattern이 없으면 schedule에서 다음 항목 찾기
  const completed = new Set(goal.progress.completedScheduleItems);
  const nextItem = goal.roadmap.schedule.find(
    item => !completed.has(`${goal.id}-${item.week}-${item.day}`)
  );

  if (nextItem) {
    const date = getDateFromWeekAndDay(goal.startDate, nextItem.week, nextItem.day);
    return date.toISOString().split('T')[0];
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = getDayOfWeek(today);
  const currentWeek = getWeekNumberFromStart(goal.startDate, today);

  // weeklyPattern이 있으면 선택된 요일 기준으로 계산
  if (goal.weeklyPattern && goal.weeklyPattern.selectedDays) {
    const { selectedDays } = goal.weeklyPattern;

    // 오늘 이후 가장 가까운 선택된 요일 찾기
    const nextDay = selectedDays.find(day => day >= currentDay);
    const targetDay = nextDay || selectedDays[0];
    const targetWeek = nextDay ? currentWeek : currentWeek + 1;

    // 해당 주차의 활동 찾기
    const weekActivities = goal.roadmap.schedule.filter(item => item.week === targetWeek);

    if (weekActivities.length > 0) {
      return weekActivities[0].title;
    }

    return `${goal.title} - Week ${targetWeek} Day ${targetDay}`;
  }

  // weeklyPattern이 없으면 schedule에서 다음 항목 찾기
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
