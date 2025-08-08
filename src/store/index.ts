import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppState } from '../types/store';

// UI 상태 초기값
const initialUIState = {
  currentScreen: 'Home',
  isModalOpen: false,
  modalType: null,
  toast: null,
};

// 폼 상태 초기값
const initialFormState = {
  goalForm: {
    title: '',
    description: '',
    category: '',
    targetDate: null,
  },
  profileForm: {
    name: '',
    email: '',
  },
};

// 앱 설정 초기값
const initialSettingsState = {
  theme: 'auto' as const,
  language: 'ko' as const,
  notifications: {
    enabled: true,
    dailyReminder: true,
    weeklyReport: true,
  },
};

// Zustand 스토어 생성 (클라이언트 상태만)
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // ===== UI 상태 =====
        ui: {
          ...initialUIState,
          
          setCurrentScreen: (currentScreen) => set((state) => ({
            ui: { ...state.ui, currentScreen }
          })),
          
          openModal: (modalType) => set((state) => ({
            ui: { ...state.ui, isModalOpen: true, modalType }
          })),
          
          closeModal: () => set((state) => ({
            ui: { ...state.ui, isModalOpen: false, modalType: null }
          })),
          
          showToast: (message, type = 'info') => set((state) => ({
            ui: { 
              ...state.ui, 
              toast: { message, type, visible: true } 
            }
          })),
          
          hideToast: () => set((state) => ({
            ui: { ...state.ui, toast: null }
          })),
        },

        // ===== 폼 상태 =====
        forms: {
          ...initialFormState,
          
          setGoalForm: (data) => set((state) => ({
            forms: {
              ...state.forms,
              goalForm: { ...state.forms.goalForm, ...data }
            }
          })),
          
          setProfileForm: (data) => set((state) => ({
            forms: {
              ...state.forms,
              profileForm: { ...state.forms.profileForm, ...data }
            }
          })),
          
          resetGoalForm: () => set((state) => ({
            forms: {
              ...state.forms,
              goalForm: initialFormState.goalForm
            }
          })),
          
          resetProfileForm: () => set((state) => ({
            forms: {
              ...state.forms,
              profileForm: initialFormState.profileForm
            }
          })),
        },

        // ===== 앱 설정 상태 =====
        settings: {
          ...initialSettingsState,
          
          setTheme: (theme) => set((state) => ({
            settings: { ...state.settings, theme }
          })),
          
          setLanguage: (language) => set((state) => ({
            settings: { ...state.settings, language }
          })),
          
          setNotifications: (settings) => set((state) => ({
            settings: {
              ...state.settings,
              notifications: { ...state.settings.notifications, ...settings }
            }
          })),
        },
      }),
      {
        name: 'smallstep-client-store', // 로컬 스토리지 키
        partialize: (state) => ({
          // 클라이언트 상태만 저장
          ui: {
            currentScreen: state.ui.currentScreen,
          },
          forms: state.forms,
          settings: state.settings,
        }),
      }
    ),
    {
      name: 'SmallStep Client Store', // DevTools에서 표시될 이름
    }
  )
);
