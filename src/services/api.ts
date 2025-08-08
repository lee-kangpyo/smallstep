import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  User, UserCreate, UserUpdate,
  Goal, GoalCreate, GoalUpdate,
  Activity, ActivityCreate, ActivityUpdate,
  GameData, GameDataCreate, GameDataUpdate,
  GoalAnalysisRequest, GoalAnalysisResponse,
  AIFeedbackRequest, AIFeedbackResponse,
  HealthCheckResponse,
  ApiResponse, LoadingState
} from '../types/api';
import { config } from '../config/env';
import { handleApiError, withRetry, handleNetworkError } from '../utils/errorHandler';

class ApiService {
  private api: AxiosInstance;

  constructor() {
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
          console.log('API Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
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
        // 네트워크 에러 처리
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
  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
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

// SmallStep API 엔드포인트 함수들 (타입 안전성 확보)
export const smallstepApi = {
  // 헬스체크
  healthCheck: () => apiService.get<HealthCheckResponse>("/api/smallstep/health"),
  
  // 사용자 관리
  createUser: (userData: UserCreate) => apiService.post<User>("/api/smallstep/users", userData),
  getUser: (userId: number) => apiService.get<User>(`/api/smallstep/users/${userId}`),
  
  // 목표 관리
  createGoal: (goalData: GoalCreate) => apiService.post<Goal>("/api/smallstep/goals", goalData),
  getUserGoals: (userId: number) => apiService.get<Goal[]>("/api/smallstep/goals/user/${userId}"),
  
  // 활동 관리
  createActivity: (activityData: ActivityCreate) => apiService.post<Activity>("/api/smallstep/activities", activityData),
  getGoalActivities: (goalId: number) => apiService.get<Activity[]>("/api/smallstep/activities/goal/${goalId}"),
  
  // 게임 데이터
  createGameData: (gameData: GameDataCreate) => apiService.post<GameData>("/api/smallstep/game-data", gameData),
  getUserGameData: (userId: number) => apiService.get<GameData>(`/api/smallstep/game-data/user/${userId}`),
  
  // LLM 서비스
  analyzeGoal: (goalData: GoalAnalysisRequest) => apiService.post<GoalAnalysisResponse>("/api/smallstep/llm/analyze-goal", goalData),
  generateFeedback: (feedbackData: AIFeedbackRequest) => apiService.post<AIFeedbackResponse>("/api/smallstep/llm/generate-feedback", feedbackData),
};

// 기존 API 함수들 (하위 호환성)
export const api = {
  // 예시 API 함수들 (실제 FastAPI 엔드포인트에 맞게 수정 필요)
  getUsers: () => apiService.get("/users"),
  getUserById: (id: string) => apiService.get(`/users/${id}`),
  createUser: (userData: any) => apiService.post("/users", userData),
  updateUser: (id: string, userData: any) =>
    apiService.put(`/users/${id}`, userData),
  deleteUser: (id: string) => apiService.delete(`/users/${id}`),
};
