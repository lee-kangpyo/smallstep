import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { smallstepApi } from '../services/api';
import { UserCreate, GoalCreate, ActivityCreate, GoalAnalysisRequest, AIFeedbackRequest } from '../types/api';

// ===== 사용자 관련 쿼리 =====
export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await smallstepApi.getUser(userId);
      if (!response.success || !response.data) {
        throw new Error(response.error || '사용자 정보 조회에 실패했습니다.');
      }
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useGameData = (userId: number) => {
  return useQuery({
    queryKey: ['gameData', userId],
    queryFn: async () => {
      const response = await smallstepApi.getUserGameData(userId);
      if (!response.success || !response.data) {
        throw new Error(response.error || '게임 데이터 조회에 실패했습니다.');
      }
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: UserCreate) => {
      const response = await smallstepApi.createUser(userData);
      if (!response.success || !response.data) {
        throw new Error(response.error || '사용자 생성에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // 사용자 생성 후 캐시 업데이트
      queryClient.setQueryData(['user', data.id], data);
    },
  });
};

// ===== 목표 관련 쿼리 =====
export const useGoals = (userId: number) => {
  return useQuery({
    queryKey: ['goals', userId],
    queryFn: async () => {
      const response = await smallstepApi.getUserGoals(userId);
      if (!response.success || !response.data) {
        throw new Error(response.error || '목표 조회에 실패했습니다.');
      }
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (goalData: GoalCreate) => {
      const response = await smallstepApi.createGoal(goalData);
      if (!response.success || !response.data) {
        throw new Error(response.error || '목표 생성에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // 목표 생성 후 목표 목록 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['goals', data.user_id] });
    },
  });
};

export const useGoalAnalysis = () => {
  return useMutation({
    mutationFn: async (goalData: GoalAnalysisRequest) => {
      const response = await smallstepApi.analyzeGoal(goalData);
      if (!response.success || !response.data) {
        throw new Error(response.error || '목표 분석에 실패했습니다.');
      }
      return response.data;
    },
  });
};

// ===== 활동 관련 쿼리 =====
export const useActivities = (goalId: number) => {
  return useQuery({
    queryKey: ['activities', goalId],
    queryFn: async () => {
      const response = await smallstepApi.getGoalActivities(goalId);
      if (!response.success || !response.data) {
        throw new Error(response.error || '활동 조회에 실패했습니다.');
      }
      return response.data;
    },
    enabled: !!goalId,
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activityData: ActivityCreate) => {
      const response = await smallstepApi.createActivity(activityData);
      if (!response.success || !response.data) {
        throw new Error(response.error || '활동 생성에 실패했습니다.');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // 활동 생성 후 활동 목록 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['activities', data.goal_id] });
    },
  });
};

// ===== 피드백 관련 쿼리 =====
export const useGenerateFeedback = () => {
  return useMutation({
    mutationFn: async (feedbackData: AIFeedbackRequest) => {
      const response = await smallstepApi.generateFeedback(feedbackData);
      if (!response.success || !response.data) {
        throw new Error(response.error || '피드백 생성에 실패했습니다.');
      }
      return response.data;
    },
  });
};

// ===== 헬스체크 =====
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await smallstepApi.healthCheck();
      if (!response.success || !response.data) {
        throw new Error(response.error || '서버 상태 확인에 실패했습니다.');
      }
      return response.data;
    },
    refetchInterval: 30000, // 30초마다 재확인
    refetchIntervalInBackground: true,
  });
};

// ===== 편의 훅 =====
export const useServerState = (userId: number) => {
  const userQuery = useUser(userId);
  const gameDataQuery = useGameData(userId);
  const goalsQuery = useGoals(userId);
  
  return {
    user: userQuery.data,
    gameData: gameDataQuery.data,
    goals: goalsQuery.data,
    isLoading: userQuery.isLoading || gameDataQuery.isLoading || goalsQuery.isLoading,
    error: userQuery.error || gameDataQuery.error || goalsQuery.error,
  };
};

// ===== 쿼리 키 상수 =====
export const queryKeys = {
  user: (userId: number) => ['user', userId],
  gameData: (userId: number) => ['gameData', userId],
  goals: (userId: number) => ['goals', userId],
  activities: (goalId: number) => ['activities', goalId],
  health: ['health'],
} as const;
