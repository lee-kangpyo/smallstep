import { NavigatorScreenParams } from '@react-navigation/native';

// ===== 메인 탭 네비게이션 =====
export type MainTabParamList = {
  Home: { userId: number };
  Goals: { userId: number };
  Activities: { goalId?: number; userId: number };
  Profile: { userId: number };
};

// ===== 스택 네비게이션 =====
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  GoalDetail: { goalId: number; userId: number };
  ActivityDetail: { activityId: number; goalId: number };
  CreateGoal: { userId: number };
  CreateActivity: { goalId: number };
  Settings: undefined;
};

// ===== 네비게이션 프로퍼티 타입 =====
export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: {
    navigate: (screen: T, params?: RootStackParamList[T]) => void;
    goBack: () => void;
    push: (screen: T, params?: RootStackParamList[T]) => void;
    pop: () => void;
    popToTop: () => void;
  };
  route: {
    params: RootStackParamList[T];
  };
};

// ===== 탭 네비게이션 프로퍼티 타입 =====
export type TabNavigationProps<T extends keyof MainTabParamList> = {
  navigation: {
    navigate: (screen: T, params?: MainTabParamList[T]) => void;
    goBack: () => void;
  };
  route: {
    params: MainTabParamList[T];
  };
};
