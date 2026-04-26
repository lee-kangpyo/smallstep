// SmallStep v2 앱 타입 정의

// ===== Phase 타입 =====
export interface Phase {
  id: number;
  goal_id: number;
  phase_order: number;
  phase_title: string;
  phase_description: string;
  estimated_weeks: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  started_at?: string;
  completed_at?: string;
}

// ===== 주간 계획 타입 =====
export interface WeeklyPlan {
  id: number;
  goal_id: number;
  phase_id: number;
  week_start_date: string;
  week_end_date: string;
  tasks: Task[];
}

// ===== 태스크 타입 =====
export interface Task {
  id: number;
  weekly_plan_id: number;
  task_order: number;
  task_title: string;
  task_description: string;
  estimated_minutes: number;
  status: 'LOCKED' | 'AVAILABLE' | 'COMPLETED' | 'SKIPPED';
  completed_at?: string;
}

// ===== 사용자 타입 =====
export interface User {
  id: number;
  name: string;
  email?: string;
  level: number;
  consecutive_days: number;
  total_steps: number;
  completed_steps: number;
  current_goal?: string;
  created_at: string;
  updated_at: string;
}

// ===== 목표 타입 =====
export interface Goal {
  id: number;
  title: string;
  description?: string;
  category?: string;
  status: string;
  progress: number;
  target_date?: string;
  created_at: string;
  updated_at: string;
}

// ===== 통계 타입 =====
export interface StatsOverview {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  total_tasks: number;
  completed_tasks: number;
  skipped_tasks: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  experience_points: number;
  next_level_xp: number;
  weekly_completion_rate: number;
}

export interface WeeklyStats {
  week_start_date: string;
  week_end_date: string;
  total_tasks: number;
  completed_tasks: number;
  completion_rate: number;
}

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last_completed_date?: string;
  streak_history: { date: string; completed: boolean }[];
}

// ===== 타입 가드 함수들 =====
export const isPhase = (obj: any): obj is Phase => {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.goal_id === 'number' &&
    typeof obj.phase_order === 'number' &&
    typeof obj.phase_title === 'string' &&
    typeof obj.phase_description === 'string' &&
    typeof obj.estimated_weeks === 'number' &&
    ['PENDING', 'ACTIVE', 'COMPLETED'].includes(obj.status)
  );
};

export const isTask = (obj: any): obj is Task => {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.weekly_plan_id === 'number' &&
    typeof obj.task_order === 'number' &&
    typeof obj.task_title === 'string' &&
    typeof obj.task_description === 'string' &&
    typeof obj.estimated_minutes === 'number' &&
    ['LOCKED', 'AVAILABLE', 'COMPLETED', 'SKIPPED'].includes(obj.status)
  );
};

export const isGoal = (obj: any): obj is Goal => {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.progress === 'number'
  );
};

export const isUser = (obj: any): obj is User => {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.level === 'number' &&
    typeof obj.consecutive_days === 'number'
  );
};

// ===== 유틸리티 함수들 =====
export const calculateProgress = (completed: number, total: number): number => {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getTaskStatusLabel = (status: Task['status']): string => {
  const labels = {
    LOCKED: '잠김',
    AVAILABLE: '진행 중',
    COMPLETED: '완료',
    SKIPPED: '걱정',
  };
  return labels[status];
};

export const getPhaseStatusLabel = (status: Phase['status']): string => {
  const labels = {
    PENDING: '대기 중',
    ACTIVE: '진행 중',
    COMPLETED: '완료',
  };
  return labels[status];
};
