import { create } from "zustand";
import { Task, WeeklyPlan } from "../types";
import { smallstepApi } from "../services/api";

interface TaskState {
  todayTasks: Task[];
  currentWeeklyPlan: WeeklyPlan | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTodayTasks: () => Promise<void>;
  completeTask: (id: number) => Promise<void>;
  fetchCurrentWeeklyPlan: (goalId: number) => Promise<void>;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  todayTasks: [],
  currentWeeklyPlan: null,
  isLoading: false,
  error: null,

  // Actions
  fetchTodayTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await smallstepApi.fetchTodayTasks();
      if (response.success && response.data) {
        set({ todayTasks: response.data, isLoading: false });
      } else {
        set({ error: response.error || '오늘의 할 일을 불러오는데 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("오늘의 할 일 로드 실패:", error);
      set({ error: '오늘의 할 일을 불러오는데 실패했습니다', isLoading: false });
    }
  },

  completeTask: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await smallstepApi.completeTask(id);
      if (response.success && response.data) {
        // 완료된 태스크 상태 업데이트
        const updatedTasks = get().todayTasks.map((task) =>
          task.id === id ? response.data! : task
        );
        set({ todayTasks: updatedTasks, isLoading: false });
      } else {
        set({ error: response.error || '태스크 완료 처리에 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("태스크 완료 실패:", error);
      set({ error: '태스크 완료 처리에 실패했습니다', isLoading: false });
    }
  },

  fetchCurrentWeeklyPlan: async (goalId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await smallstepApi.fetchCurrentWeeklyPlan(goalId);
      if (response.success && response.data) {
        set({ currentWeeklyPlan: response.data, isLoading: false });
      } else {
        set({ error: response.error || '주간 계획을 불러오는데 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("주간 계획 로드 실패:", error);
      set({ error: '주간 계획을 불러오는데 실패했습니다', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
