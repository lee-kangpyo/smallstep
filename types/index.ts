// AI가 생성하는 로드맵 기반 데이터 구조
// 기존 SmallStep 구조와 호환성을 유지하면서 확장

// ===== AI 로드맵 구조 =====
export interface Roadmap {
  roadmap: Phase[];
  schedule: ScheduleItem[];
}

export interface Phase {
  phase: number;
  phase_title: string;
  phase_description: string;
  key_milestones: string[];
}

export interface ScheduleItem {
  week: number;
  day: number;
  phase_link: number;
  activity_type: string;
  title: string;
  description: string;
}

// ===== 주간 패턴 설정 =====
export interface WeeklyPattern {
  frequency: number;      // 주 몇 회 (예: 3)
  selectedDays: number[];  // 선택된 요일 [1,3,5] = 월,수,금 (1=월, 2=화, ..., 7=일)
}

// ===== 다중 목표 지원 구조 =====
export interface User {
  id: string;
  name: string;
  goals: Goal[];
  activeGoalId: string; // 현재 활성 목표
  level: number;
  consecutiveDays: number;
  totalSteps: number;
  completedSteps: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: "active" | "paused" | "completed";
  priority: number;
  createdAt: Date;
  roadmap: Roadmap;
  progress: GoalProgress;
  startDate: string;           // ISO date string: "2024-01-15"
  weeklyPattern: WeeklyPattern; // 주간 패턴 정보
}

export interface GoalProgress {
  currentPhase: number;
  completedPhases: number[];
  completedScheduleItems: string[];
  totalProgress: number; // 0-100%
  consecutiveDays: number;
  lastCompletedDate?: Date;
}

// ===== 기존 구조와의 호환성 =====
// 기존 SmallStep을 새로운 구조와 호환되도록 확장
export interface SmallStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  // 새로운 필드들
  phaseLink?: number;
  scheduleItemId?: string;
}

export interface GoalAnalysis {
  originalGoal: string;
  smallSteps: SmallStep[];
  totalEstimatedTime: string;
  aiMessage: string;
  // 새로운 필드들
  roadmap?: Roadmap;
}

// ===== 타입 가드 함수들 =====
export const isRoadmap = (obj: any): obj is Roadmap => {
  return (
    obj &&
    Array.isArray(obj.roadmap) &&
    Array.isArray(obj.schedule) &&
    obj.roadmap.every((phase: any) => isPhase(phase)) &&
    obj.schedule.every((item: any) => isScheduleItem(item))
  );
};

export const isPhase = (obj: any): obj is Phase => {
  return (
    obj &&
    typeof obj.phase === "number" &&
    typeof obj.phase_title === "string" &&
    typeof obj.phase_description === "string" &&
    Array.isArray(obj.key_milestones)
  );
};

export const isScheduleItem = (obj: any): obj is ScheduleItem => {
  return (
    obj &&
    typeof obj.week === "number" &&
    typeof obj.day === "number" &&
    typeof obj.phase_link === "number" &&
    typeof obj.activity_type === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string"
  );
};

export const isGoal = (obj: any): obj is Goal => {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.title === "string" &&
    typeof obj.description === "string" &&
    ["active", "paused", "completed"].includes(obj.status) &&
    typeof obj.priority === "number" &&
    obj.createdAt instanceof Date &&
    isRoadmap(obj.roadmap) &&
    isGoalProgress(obj.progress) &&
    typeof obj.startDate === "string" &&
    obj.weeklyPattern &&
    typeof obj.weeklyPattern.frequency === "number" &&
    Array.isArray(obj.weeklyPattern.selectedDays)
  );
};

export const isGoalProgress = (obj: any): obj is GoalProgress => {
  return (
    obj &&
    typeof obj.currentPhase === "number" &&
    Array.isArray(obj.completedPhases) &&
    Array.isArray(obj.completedScheduleItems) &&
    typeof obj.totalProgress === "number" &&
    obj.totalProgress >= 0 &&
    obj.totalProgress <= 100
  );
};

// ===== 유틸리티 함수들 =====
export const calculateGoalProgress = (goal: Goal): number => {
  if (!goal.roadmap || !goal.roadmap.schedule) return 0;

  const totalItems = goal.roadmap.schedule.length;
  const completedItems = goal.progress.completedScheduleItems.length;

  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
};

export const getCurrentPhase = (goal: Goal): Phase | null => {
  if (!goal.roadmap || !goal.roadmap.roadmap) return null;

  const currentPhase = goal.roadmap.roadmap.find(
    (phase) => phase.phase === goal.progress.currentPhase
  );

  return currentPhase || null;
};

export const getTodayScheduleItem = (goal: Goal): ScheduleItem | null => {
  if (!goal.roadmap || !goal.roadmap.schedule) return null;

  const today = new Date();
  const currentWeek = Math.ceil(today.getDate() / 7);
  const currentDay = today.getDay() || 7; // 일요일을 7로 변환

  const todayItem = goal.roadmap.schedule.find(
    (item) => item.week === currentWeek && item.day === currentDay
  );

  return todayItem || null;
};

// ===== 기존 구조와의 변환 함수들 =====
export const convertSmallStepToScheduleItem = (
  smallStep: SmallStep,
  week: number,
  day: number,
  phaseLink: number
): ScheduleItem => {
  return {
    week,
    day,
    phase_link: phaseLink,
    activity_type: smallStep.category,
    title: smallStep.title,
    description: smallStep.description,
  };
};

export const convertGoalAnalysisToRoadmap = (
  goalAnalysis: GoalAnalysis
): Roadmap => {
  // 간단한 변환 예시 - 실제로는 AI가 생성한 로드맵을 사용
  const phases: Phase[] = [
    {
      phase: 1,
      phase_title: "기초 단계",
      phase_description: "목표 달성을 위한 기본 단계",
      key_milestones: goalAnalysis.smallSteps
        .slice(0, 2)
        .map((step) => step.title),
    },
  ];

  const schedule: ScheduleItem[] = goalAnalysis.smallSteps.map(
    (step, index) => ({
      week: Math.floor(index / 7) + 1,
      day: (index % 7) + 1,
      phase_link: 1,
      activity_type: step.category,
      title: step.title,
      description: step.description,
    })
  );

  return { roadmap: phases, schedule };
};
