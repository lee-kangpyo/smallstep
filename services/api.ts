import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  User, UserCreate,
  Goal, GoalCreate,
  Phase,
  WeeklyPlan, WeeklyPlanCreate,
  Task,
  ActivityLog,
  StatsOverview, WeeklyStats, StreakInfo,
  HealthCheckResponse,
  ApiResponse,
} from '../types/api';
import { config } from '../config/env';
import { handleApiError, withRetry, handleNetworkError } from '../utils/errorHandler';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    console.log('[api.ts] ApiService 생성 시 config.api.baseURL:', config.api.baseURL);
    
    this.api = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터
    this.api.interceptors.request.use(
      (config) => {
        if (__DEV__) {
          console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
          console.log('🔗 Full URL:', (config.baseURL || '') + (config.url || ''));
          console.log('📋 Request Config:', {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            fullURL: (config.baseURL || '') + (config.url || ''),
            headers: config.headers,
            data: config.data
          });
        }
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        if (__DEV__) {
          console.log('API Response:', response.status, response.config.url);
        }
        return response;
      },
      async (error: AxiosError) => {
        // Axios 에러인 경우 (백엔드 응답이 있는 경우)
        if (error.response) {
          // HTTP 상태 코드가 있는 경우는 서버 에러
          const appError = handleApiError(error);
          console.error('API Response Error:', appError);
          return Promise.reject(appError);
        }
        
        // 실제 네트워크 에러인 경우만 handleNetworkError 호출
        // (error.response가 없는 경우: 연결 실패, 타임아웃 등)
        const appError = await handleNetworkError(error);
        console.error('API Response Error:', appError);
        return Promise.reject(appError);
      }
    );
  }

  // GET 요청 (재시도 로직 포함)
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return withRetry(async () => {
      try {
        const response = await this.api.get<T>(endpoint);
        return { success: true, data: response.data };
      } catch (error) {
        const appError = handleApiError(error, endpoint);
        return {
          success: false,
          error: appError.userMessage,
        };
      }
    });
  }

  // POST 요청 (재시도 로직 포함)
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return withRetry(async () => {
      try {
        const response = await this.api.post<T>(endpoint, body);
        return { success: true, data: response.data };
      } catch (error) {
        const appError = handleApiError(error, endpoint);
        return {
          success: false,
          error: appError.userMessage,
        };
      }
    });
  }

  // PUT 요청 (재시도 로직 포함)
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return withRetry(async () => {
      try {
        const response = await this.api.put<T>(endpoint, body);
        return { success: true, data: response.data };
      } catch (error) {
        const appError = handleApiError(error, endpoint);
        return {
          success: false,
          error: appError.userMessage,
        };
      }
    });
  }

  // DELETE 요청 (재시도 로직 포함)
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return withRetry(async () => {
      try {
        const response = await this.api.delete<T>(endpoint);
        return { success: true, data: response.data };
      } catch (error) {
        const appError = handleApiError(error, endpoint);
        return {
          success: false,
          error: appError.userMessage,
        };
      }
    });
  }
}

// API 서비스 인스턴스 생성
export const apiService = new ApiService();

// SmallStep v2 API 엔드포인트 함수들
export const smallstepApi = {
  // 헬스체크
  healthCheck: () => apiService.get<HealthCheckResponse>("/api/smallstep/health"),
  
  // 사용자 관리
  createUser: (userData: UserCreate) => apiService.post<User>("/api/smallstep/users", userData),
  getUser: (userId: number) => apiService.get<User>(`/api/smallstep/users/${userId}`),
  
  // 목표 관리
  fetchGoals: () => apiService.get<Goal[]>("/api/smallstep/goals"),
  createGoal: (goalData: GoalCreate) => apiService.post<Goal>("/api/smallstep/goals", goalData),
  getGoalDetail: (goalId: number) => apiService.get<Goal>(`/api/smallstep/goals/${goalId}`),
  
  // Phase 관리
  fetchPhases: (goalId: number) => apiService.get<Phase[]>(`/api/smallstep/goals/${goalId}/phases`),
  getPhaseDetail: (phaseId: number) => apiService.get<Phase>(`/api/smallstep/phases/${phaseId}`),
  
  // 주간 계획 관리
  generateWeeklyPlan: (data: WeeklyPlanCreate) => apiService.post<WeeklyPlan>("/api/smallstep/weekly-plans/generate", data),
  fetchCurrentWeeklyPlan: (goalId: number) => apiService.get<WeeklyPlan>(`/api/smallstep/goals/${goalId}/current-weekly-plan`),
  fetchWeeklyPlan: (planId: number) => apiService.get<WeeklyPlan>(`/api/smallstep/weekly-plans/${planId}`),
  
  // 태스크 관리
  fetchTodayTasks: () => apiService.get<Task[]>("/api/smallstep/tasks/today"),
  completeTask: (taskId: number) => apiService.put<Task>(`/api/smallstep/tasks/${taskId}/complete`),

  // 활동 로그
  fetchActivityLogs: (goalId: number) => apiService.get<ActivityLog[]>(`/api/smallstep/goals/${goalId}/activity-logs`),
  
  // 통계
  fetchStatsOverview: (userId: number) => apiService.get<StatsOverview>(`/api/smallstep/stats/overview?user_id=${userId}`),
  fetchWeeklyStats: (userId: number) => apiService.get<WeeklyStats[]>(`/api/smallstep/stats/weekly?user_id=${userId}`),
  fetchStreakInfo: (userId: number) => apiService.get<StreakInfo>(`/api/smallstep/stats/streak?user_id=${userId}`),
};

// 기본 API 함수들 (하위 호환성)
export const api = {
  get: <T>(endpoint: string) => apiService.get<T>(endpoint),
  post: <T>(endpoint: string, body: any) => apiService.post<T>(endpoint, body),
  put: <T>(endpoint: string, body?: any) => apiService.put<T>(endpoint, body),
  delete: <T>(endpoint: string) => apiService.delete<T>(endpoint),
};
