import { create } from "zustand";
import { User, StatsOverview, StreakInfo } from "../types";
import { smallstepApi } from "../services/api";

interface UserState {
  user: User | null;
  stats: StatsOverview | null;
  streakInfo: StreakInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchUser: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchStreakInfo: () => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // Initial state
  user: null,
  stats: null,
  streakInfo: null,
  isLoading: false,
  error: null,

  // Actions
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 실제 사용자 ID를 저장소에서 가져와야 함
      const userId = 1;
      const response = await smallstepApi.getUser(userId);
      if (response.success && response.data) {
        set({ user: response.data, isLoading: false });
      } else {
        set({ error: response.error || '사용자 정보를 불러오는데 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
      set({ error: '사용자 정보를 불러오는데 실패했습니다', isLoading: false });
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = 1; // MVP용 고정 ID
      const response = await smallstepApi.fetchStatsOverview(userId);
      if (response.success && response.data) {
        set({ stats: response.data, isLoading: false });
      } else {
        set({ error: response.error || '통계 정보를 불러오는데 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("통계 정보 로드 실패:", error);
      set({ error: '통계 정보를 불러오는데 실패했습니다', isLoading: false });
    }
  },

  fetchStreakInfo: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = 1; // MVP용 고정 ID
      const response = await smallstepApi.fetchStreakInfo(userId);
      if (response.success && response.data) {
        set({ streakInfo: response.data, isLoading: false });
      } else {
        set({ error: response.error || '스트릭 정보를 불러오는데 실패했습니다', isLoading: false });
      }
    } catch (error) {
      console.error("스트릭 정보 로드 실패:", error);
      set({ error: '스트릭 정보를 불러오는데 실패했습니다', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
