// SmallStep v2 API 타입 정의

// ===== 사용자 관련 타입 =====
export interface UserBase {
  name: string;
  email?: string;
}

export interface UserCreate extends UserBase {
  // UserBase를 상속받음
}

export interface UserUpdate {
  name?: string;
  email?: string;
  level?: number;
  consecutive_days?: number;
  total_steps?: number;
  completed_steps?: number;
  current_goal?: string;
}

export interface User extends UserBase {
  id: number;
  level: number;
  consecutive_days: number;
  total_steps: number;
  completed_steps: number;
  current_goal?: string;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

// ===== 목표 관련 타입 =====
export interface GoalBase {
  title: string;
  description?: string;
  category?: string;
  target_date?: string; // ISO datetime string
}

export interface GoalCreate {
  title: string;
  description?: string;
  daily_minutes?: number;
  deadline_date?: string;
  current_level?: string;
}

export interface GoalUpdate {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  progress?: number;
  target_date?: string; // ISO datetime string
}

export interface Goal extends GoalBase {
  id: number;
  status: string;
  progress: number;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

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

export interface WeeklyPlanCreate {
  goal_id: number;
  phase_id: number;
  week_start_date: string;
  week_end_date: string;
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

// ===== 활동 로그 타입 =====
export interface ActivityLog {
  id: number;
  user_id: number;
  task_id: number;
  action: string;
  xp_earned: number;
  created_at: string;
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
  daily_completion?: number[];
}

export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last_completed_date?: string;
  streak_history: { date: string; completed: boolean }[];
}

// ===== API 응답 타입 =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ===== 에러 응답 타입 =====
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    userMessage: string;
    details?: any;
  };
}

// ===== 로딩 상태 타입 =====
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retryable: boolean;
}

// ===== 헬스체크 타입 =====
export interface HealthCheckResponse {
  status: string;
  service: string;
}

// ===== v1 타입 제거됨 =====
// Activity, GoalTemplate, GameData, RoadmapPhase, TemplatePreviewData 등은 v2에서 사용하지 않음
