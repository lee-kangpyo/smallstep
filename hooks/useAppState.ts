import { useAppStore } from '../store';
import { AppState } from '../types/store';

// ===== UI 상태 훅 =====
export const useUIState = () => {
  return useAppStore((state) => state.ui);
};

export const useCurrentScreen = () => {
  return useAppStore((state) => state.ui.currentScreen);
};

export const useModal = () => {
  return useAppStore((state) => ({
    isOpen: state.ui.isModalOpen,
    type: state.ui.modalType,
  }));
};

export const useToast = () => {
  return useAppStore((state) => state.ui.toast);
};

// ===== 폼 상태 훅 =====
export const useFormState = () => {
  return useAppStore((state) => state.forms);
};

export const useGoalForm = () => {
  return useAppStore((state) => state.forms.goalForm);
};

export const useProfileForm = () => {
  return useAppStore((state) => state.forms.profileForm);
};

// ===== 앱 설정 상태 훅 =====
export const useAppSettings = () => {
  return useAppStore((state) => state.settings);
};

export const useTheme = () => {
  return useAppStore((state) => state.settings.theme);
};

export const useLanguage = () => {
  return useAppStore((state) => state.settings.language);
};

export const useNotifications = () => {
  return useAppStore((state) => state.settings.notifications);
};

// ===== 액션 훅 =====
export const useUIActions = () => {
  const { setCurrentScreen, openModal, closeModal, showToast, hideToast } = useAppStore((state) => state.ui);
  return { setCurrentScreen, openModal, closeModal, showToast, hideToast };
};

export const useFormActions = () => {
  const { setGoalForm, setProfileForm, resetGoalForm, resetProfileForm } = useAppStore((state) => state.forms);
  return { setGoalForm, setProfileForm, resetGoalForm, resetProfileForm };
};

export const useSettingsActions = () => {
  const { setTheme, setLanguage, setNotifications } = useAppStore((state) => state.settings);
  return { setTheme, setLanguage, setNotifications };
};

// ===== 편의 훅 =====
export const useAppState = () => {
  return useAppStore((state) => state);
};

export const useIsModalOpen = () => {
  return useAppStore((state) => state.ui.isModalOpen);
};

export const useCurrentModalType = () => {
  return useAppStore((state) => state.ui.modalType);
};

// ===== 선택자 훅 =====
export const useStoreSelector = <T>(selector: (state: AppState) => T) => {
  return useAppStore(selector);
};
