import { create } from "zustand";
import { Goal, Phase } from "../types";
import { smallstepApi } from "../services/api";

interface GoalState {
  goals: Goal[];
  currentGoal: Goal | null;
  phases: Phase[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchGoals: () => Promise<void>;
  fetchGoalDetail: (id: number) => Promise<void>;
  fetchPhases: (goalId: number) => Promise<void>;
  createGoal: (data: { title: string; description?: string; daily_minutes?: number; deadline_date?: string; current_level?: string }) => Promise<void>;
  setCurrentGoal: (goal: Goal | null) => void;
  clearError: () => void;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  // Initial state
  goals: [],
  currentGoal: null,
  phases: [],
  isLoading: false,
  error: null,

  // Actions
  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await smallstepApi.fetchGoals();
      if (response.success && response.data) {
        set({ goals: response.data, isLoading: false });
      } else {
        set({ error: response.error || '목표를 불러오는데 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("목표 로드 실패:", error);
      set({ error: '목표를 불러오는데 실패했습니다', isLoading: false });
    }
  },

  fetchGoalDetail: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await smallstepApi.getGoalDetail(id);
      if (response.success && response.data) {
        set({ currentGoal: response.data, isLoading: false });
      } else {
        set({ error: response.error || '목표 상세 정보를 불러오는데 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("목표 상세 로드 실패:", error);
      set({ error: '목표 상세 정보를 불러오는데 실패했습니다', isLoading: false });
    }
  },

  fetchPhases: async (goalId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await smallstepApi.fetchPhases(goalId);
      if (response.success && response.data) {
        set({ phases: response.data, isLoading: false });
      } else {
        set({ error: response.error || 'Phase 정보를 불러오는데 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("Phase 로드 실패:", error);
      set({ error: 'Phase 정보를 불러오는데 실패했습니다', isLoading: false });
    }
  },

  createGoal: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await smallstepApi.createGoal(data);
      if (response.success && response.data) {
        const currentGoals = get().goals;
        set({ goals: [...currentGoals, response.data], isLoading: false });
      } else {
        set({ error: response.error || '목표 생성에 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("목표 생성 실패:", error);
      set({ error: '목표 생성에 실패했습니다', isLoading: false });
    }
  },

  setCurrentGoal: (goal) => set({ currentGoal: goal }),
  clearError: () => set({ error: null }),
}));
