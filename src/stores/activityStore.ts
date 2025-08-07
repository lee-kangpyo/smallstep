import { create } from "zustand";
import { ScheduleItem } from "../types";

interface ActivityState {
  todayActivities: ScheduleItem[];
  completedActivities: string[];
  currentPhase: any | null;

  // Actions
  setTodayActivities: (activities: ScheduleItem[]) => void;
  setCompletedActivities: (activityIds: string[]) => void;
  completeActivity: (activityId: string) => void;
  uncompleteActivity: (activityId: string) => void;
  setCurrentPhase: (phase: any) => void;
  clearCompletedActivities: () => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  // Initial state
  todayActivities: [],
  completedActivities: [],
  currentPhase: null,

  // Actions
  setTodayActivities: (activities) => set({ todayActivities: activities }),

  setCompletedActivities: (activityIds) =>
    set({ completedActivities: activityIds }),

  completeActivity: (activityId) =>
    set((state) => ({
      completedActivities: [...state.completedActivities, activityId],
    })),

  uncompleteActivity: (activityId) =>
    set((state) => ({
      completedActivities: state.completedActivities.filter(
        (id) => id !== activityId
      ),
    })),

  setCurrentPhase: (phase) => set({ currentPhase: phase }),

  clearCompletedActivities: () => set({ completedActivities: [] }),
}));
