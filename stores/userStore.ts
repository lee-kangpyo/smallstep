import { create } from "zustand";
import { Badge, mockUserData, mockUserGameData } from "../data/mockData";
import { calculateExperience, calculateLevel } from "../data/mockData";
import { Goal } from "../types";

interface UserData {
  id: string;
  name: string;
  level: number;
  consecutiveDays: number;
  totalSteps: number;
  completedSteps: number;
  currentGoal: string;
  goals?: Goal[];
  activeGoalId?: string;
}

interface UserGameData {
  level: number;
  experience: number;
  totalSteps: number;
  completedSteps: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  lastCompletedDate?: Date;
}

interface UserState {
  userData: UserData;
  userGameData: UserGameData;

  // Actions
  updateUserData: (updates: Partial<UserData>) => void;
  updateGameData: (updates: Partial<UserGameData>) => void;
  completeStep: () => void;
  resetStreak: () => void;
  addExperience: (amount: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state
  userData: mockUserData,
  userGameData: mockUserGameData,

  // Actions
  updateUserData: (updates) =>
    set((state) => ({
      userData: { ...state.userData, ...updates },
    })),

  updateGameData: (updates) =>
    set((state) => ({
      userGameData: { ...state.userGameData, ...updates },
    })),

  completeStep: () =>
    set((state) => {
      const newCompletedSteps = state.userGameData.completedSteps + 1;
      const newStreak = state.userGameData.currentStreak + 1;
      const newExperience = calculateExperience(newCompletedSteps, newStreak);
      const newLevel = calculateLevel(newExperience);

      return {
        userData: {
          ...state.userData,
          completedSteps: newCompletedSteps,
          consecutiveDays: newStreak,
        },
        userGameData: {
          ...state.userGameData,
          completedSteps: newCompletedSteps,
          currentStreak: newStreak,
          experience: newExperience,
          level: newLevel,
          lastCompletedDate: new Date(),
        },
      };
    }),

  resetStreak: () =>
    set((state) => ({
      userData: {
        ...state.userData,
        consecutiveDays: 0,
      },
      userGameData: {
        ...state.userGameData,
        currentStreak: 0,
      },
    })),

  addExperience: (amount) =>
    set((state) => {
      const newExperience = state.userGameData.experience + amount;
      const newLevel = calculateLevel(newExperience);

      return {
        userGameData: {
          ...state.userGameData,
          experience: newExperience,
          level: newLevel,
        },
      };
    }),
}));
