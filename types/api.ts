// SmallStep API 타입 정의

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

export interface GoalCreate extends GoalBase {
  user_id: number;
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
  user_id: number;
  status: string;
  progress: number;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

// ===== 활동 관련 타입 =====
export interface ActivityBase {
  title: string;
  description: string;
  activity_type: string;
}

export interface ActivityCreate extends ActivityBase {
  goal_id: number;
  week: number;
  day: number;
  phase_link: number;
}

export interface ActivityUpdate {
  title?: string;
  description?: string;
  activity_type?: string;
  is_completed?: boolean;
  completed_at?: string; // ISO datetime string
}

export interface Activity extends ActivityBase {
  id: number;
  goal_id: number;
  week: number;
  day: number;
  phase_link: number;
  is_completed: boolean;
  completed_at?: string; // ISO datetime string
  created_at: string; // ISO datetime string
}

// ===== 게임 데이터 관련 타입 =====
export interface GameDataBase {
  level: number;
  experience: number;
  current_streak: number;
  longest_streak: number;
}

export interface GameDataCreate extends GameDataBase {
  user_id: number;
}

export interface GameDataUpdate {
  level?: number;
  experience?: number;
  current_streak?: number;
  longest_streak?: number;
}

export interface GameData extends GameDataBase {
  id: number;
  user_id: number;
  last_completed_date?: string; // ISO datetime string
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
}

// ===== LLM 관련 타입 =====
export interface GoalAnalysisRequest {
  goal: string;
  duration_weeks?: number;
  weekly_frequency?: number;
}

export interface RoadmapPhase {
  phase: number;
  phase_title: string;
  phase_description: string;
  key_milestones: string[];
}

export interface GoalAnalysisResponse {
  roadmap: RoadmapPhase[];
  schedule: Activity[];
}

export interface AIFeedbackRequest {
  user_id: number;
  goal_id: number;
  completed_activities: string[];
  current_progress: number;
}

export interface AIFeedbackResponse {
  feedback_message: string;
  next_steps: string[];
  motivation_quote: string;
  progress_analysis: string;
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

// ===== 온보딩 관련 타입 =====
export interface TemplatePreviewData {
  plan_id: string;
  goal: string;
  status: string;
  needs_llm_completion: boolean;
  duration_weeks: number;
  weekly_frequency: number;
}

export interface GoalTemplate {
  id: string;
  goal_text: string;
  category: string;
  display_order: number;
  cached_plan_id: string;
  preview_data: TemplatePreviewData;
}

export interface TemplatesByCategory {
  [category: string]: GoalTemplate[];
}

export interface TemplatesResponse {
  categories: TemplatesByCategory;
  total_count: number;
}

export interface TemplateDetail {
  plan_id: string;
  goal: string;
  duration_weeks: number;
  weekly_frequency: number;
  plan_data: {
    goal: string;
    category: string;
    template_id: number;
    status: string;
    needs_llm_completion: boolean;
    created_at: string;
  };
}

export interface TemplateDetailResponse {
  template_id: string;
  goal_text: string;
  category: string;
  cached_plan_id: string;
  detail: TemplateDetail;
}

// ===== 헬스체크 타입 =====
export interface HealthCheckResponse {
  status: string;
  service: string;
}
