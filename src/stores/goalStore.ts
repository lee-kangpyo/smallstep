import { create } from "zustand";
import { Goal } from "../types";
import { mockUserWithMultipleGoals } from "../data/mockData";

interface GoalState {
  goals: Goal[];
  activeGoalId: string | null;
  selectedGoalId: string | null;

  // Actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setActiveGoal: (id: string | null) => void;
  setSelectedGoal: (id: string | null) => void;

  // Computed
  getActiveGoal: () => Goal | null;
  getSelectedGoal: () => Goal | null;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  // Initial state
  goals: mockUserWithMultipleGoals.goals,
  activeGoalId:
    mockUserWithMultipleGoals.goals.find((g) => g.status === "active")?.id ||
    null,
  selectedGoalId: null,

  // Actions
  setGoals: (goals) => set({ goals }),

  addGoal: (goal) =>
    set((state) => ({
      goals: [...state.goals, goal],
    })),

  updateGoal: (id, updates) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      ),
    })),

  deleteGoal: (id) =>
    set((state) => {
      const newGoals = state.goals.filter((goal) => goal.id !== id);
      let newActiveGoalId = state.activeGoalId;

      // 삭제된 목표가 활성 목표였다면 첫 번째 목표를 활성으로 설정
      if (state.activeGoalId === id && newGoals.length > 0) {
        newActiveGoalId = newGoals[0].id;
      } else if (newGoals.length === 0) {
        newActiveGoalId = null;
      }

      return {
        goals: newGoals,
        activeGoalId: newActiveGoalId,
      };
    }),

  setActiveGoal: (id) => set({ activeGoalId: id }),

  setSelectedGoal: (id) => set({ selectedGoalId: id }),

  // Computed
  getActiveGoal: () => {
    const state = get();
    return state.goals.find((goal) => goal.id === state.activeGoalId) || null;
  },

  getSelectedGoal: () => {
    const state = get();
    return state.goals.find((goal) => goal.id === state.selectedGoalId) || null;
  },
}));
