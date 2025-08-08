import { useNavigation as useReactNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList, MainTabParamList } from '../types/navigation';

// ===== 루트 네비게이션 훅 =====
export const useNavigation = () => {
  const navigation = useReactNavigation<any>();
  
  return {
    navigate: (screen: keyof RootStackParamList, params?: any) => 
      navigation.navigate(screen, params),
    goBack: navigation.goBack,
    canGoBack: navigation.canGoBack,
  };
};

// ===== 탭 네비게이션 훅 =====
export const useTabNavigation = () => {
  const navigation = useReactNavigation();
  
  return {
    navigate: navigation.navigate,
    goBack: navigation.goBack,
  };
};

// ===== 라우트 훅 =====
export const useRouteParams = <T extends keyof RootStackParamList>() => {
  const route = useRoute();
  return route.params as RootStackParamList[T];
};

// ===== 탭 라우트 훅 =====
export const useTabRouteParams = <T extends keyof MainTabParamList>() => {
  const route = useRoute();
  return route.params as MainTabParamList[T];
};

// ===== 네비게이션 헬퍼 함수들 =====
export const navigationHelpers = {
  // 목표 관련 네비게이션
  goToGoalDetail: (navigation: any, goalId: number, userId: number) => {
    navigation.navigate('GoalDetail', { goalId, userId });
  },
  
  goToCreateGoal: (navigation: any, userId: number) => {
    navigation.navigate('CreateGoal', { userId });
  },
  
  // 활동 관련 네비게이션
  goToActivityDetail: (navigation: any, activityId: number, goalId: number) => {
    navigation.navigate('ActivityDetail', { activityId, goalId });
  },
  
  goToCreateActivity: (navigation: any, goalId: number) => {
    navigation.navigate('CreateActivity', { goalId });
  },
  
  // 설정 관련 네비게이션
  goToSettings: (navigation: any) => {
    navigation.navigate('Settings');
  },
  
  // 홈으로 돌아가기
  goHome: (navigation: any) => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  },
};
