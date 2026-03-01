// Zustand 스토어 상태 타입 정의 (클라이언트 상태만)

// ===== 기본 상태 타입 =====
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retryable: boolean;
}

// ===== UI 상태 =====
export interface UIState {
  // 네비게이션
  currentScreen: string;
  
  // 모달/팝업
  isModalOpen: boolean;
  modalType: string | null;
  
  // 토스트 메시지
  toast: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  } | null;
  
  // 액션
  setCurrentScreen: (screen: string) => void;
  openModal: (type: string) => void;
  closeModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

// ===== 폼 상태 =====
export interface FormState {
  // 목표 생성 폼
  goalForm: {
    title: string;
    description: string;
    category: string;
    targetDate: string | null;
  };
  
  // 사용자 프로필 폼
  profileForm: {
    name: string;
    email: string;
  };
  
  // 액션
  setGoalForm: (data: Partial<FormState['goalForm']>) => void;
  setProfileForm: (data: Partial<FormState['profileForm']>) => void;
  resetGoalForm: () => void;
  resetProfileForm: () => void;
}

// ===== 앱 설정 상태 =====
export interface AppSettingsState {
  // 테마
  theme: 'light' | 'dark' | 'auto';
  
  // 언어
  language: 'ko' | 'en';
  
  // 알림 설정
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    weeklyReport: boolean;
  };
  
  // 액션
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setLanguage: (language: 'ko' | 'en') => void;
  setNotifications: (settings: Partial<AppSettingsState['notifications']>) => void;
}

// ===== 전체 앱 상태 =====
export interface AppState {
  ui: UIState;
  forms: FormState;
  settings: AppSettingsState;
}

// ===== 스토어 선택자 타입 =====
export type StoreSelector<T> = (state: AppState) => T;
