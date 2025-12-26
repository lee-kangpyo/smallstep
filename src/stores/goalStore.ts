import { create } from "zustand";
import { Goal } from "../types";
import { getGoals, saveGoal, deleteGoal as deleteGoalStorage } from "../services/storage/goalStorage";

interface GoalState {
  goals: Goal[];
  selectedGoalId: string | null;
  isLoading: boolean;

  // Actions
  loadGoals: () => Promise<void>;
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  setSelectedGoal: (id: string | null) => void;

  // Computed
  getSelectedGoal: () => Goal | null;
  getActiveGoals: () => Goal[];
}

export const useGoalStore = create<GoalState>((set, get) => ({
  // Initial state
  goals: [],
  selectedGoalId: null,
  isLoading: false,

  // Actions
  loadGoals: async () => {
    set({ isLoading: true });
    try {
      const goals = await getGoals();
      set({ goals, isLoading: false });
    } catch (error) {
      console.error("목표 로드 실패:", error);
      set({ isLoading: false });
    }
  },

  setGoals: (goals) => set({ goals }),

  addGoal: async (goal) => {
    try {
      await saveGoal(goal);
      const goals = await getGoals();
      set({ goals });
    } catch (error) {
      console.error("목표 추가 실패:", error);
    }
  },

  updateGoal: async (id, updates) => {
    try {
      const state = get();
      const goal = state.goals.find((g) => g.id === id);
      if (!goal) return;

      const updatedGoal = { ...goal, ...updates };
      await saveGoal(updatedGoal);
      const goals = await getGoals();
      set({ goals });
    } catch (error) {
      console.error("목표 업데이트 실패:", error);
    }
  },

  deleteGoal: async (id) => {
    try {
      await deleteGoalStorage(id);
      const goals = await getGoals();
      set({ goals });
    } catch (error) {
      console.error("목표 삭제 실패:", error);
    }
  },

  setSelectedGoal: (id) => set({ selectedGoalId: id }),

  // Computed
  getSelectedGoal: () => {
    const state = get();
    return state.goals.find((goal) => goal.id === state.selectedGoalId) || null;
  },

  getActiveGoals: () => {
    const state = get();
    // @smallstep:goals에 저장된 모든 목표가 활성 목표
    return state.goals;
  },
}));
