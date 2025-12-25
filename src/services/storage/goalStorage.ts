import { Goal } from '../../types';
import { storage } from './storageAdapter';

const GOALS_STORAGE_KEY = '@smallstep:goals';
const ACTIVE_GOAL_ID_KEY = '@smallstep:activeGoalId';
const USER_INFO_KEY = '@smallstep:userInfo';

interface UserInfo {
  isGuest: boolean;
  userId?: string;
}

// ===== 목표 저장/조회/삭제 =====

/**
 * 모든 목표 조회
 */
export const getGoals = async (): Promise<Goal[]> => {
  try {
    const data = await storage.getItem(GOALS_STORAGE_KEY);
    if (!data) return [];
    
    const goals = JSON.parse(data);
    // Date 객체 복원
    return goals.map((goal: any) => ({
      ...goal,
      createdAt: new Date(goal.createdAt),
      progress: {
        ...goal.progress,
        lastCompletedDate: goal.progress.lastCompletedDate 
          ? new Date(goal.progress.lastCompletedDate) 
          : undefined,
      },
    }));
  } catch (error) {
    console.error('목표 조회 실패:', error);
    return [];
  }
};

/**
 * 목표 저장
 */
export const saveGoal = async (goal: Goal): Promise<boolean> => {
  try {
    const goals = await getGoals();
    const existingIndex = goals.findIndex((g) => g.id === goal.id);
    
    if (existingIndex >= 0) {
      // 기존 목표 업데이트
      goals[existingIndex] = goal;
    } else {
      // 새 목표 추가
      goals.push(goal);
    }
    
    await storage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    return true;
  } catch (error) {
    console.error('목표 저장 실패:', error);
    return false;
  }
};

/**
 * 목표 삭제
 */
export const deleteGoal = async (goalId: string): Promise<boolean> => {
  try {
    const goals = await getGoals();
    const filteredGoals = goals.filter((g) => g.id !== goalId);
    
    await storage.setItem(GOALS_STORAGE_KEY, JSON.stringify(filteredGoals));
    
    // 삭제한 목표가 활성 목표였다면 활성 목표 해제
    const activeGoalId = await getActiveGoalId();
    if (activeGoalId === goalId) {
      await storage.removeItem(ACTIVE_GOAL_ID_KEY);
    }
    
    return true;
  } catch (error) {
    console.error('목표 삭제 실패:', error);
    return false;
  }
};

/**
 * 목표 개수 조회
 */
export const getGoalCount = async (): Promise<number> => {
  const goals = await getGoals();
  return goals.length;
};

// ===== 활성 목표 관리 =====

/**
 * 활성 목표 ID 조회
 */
export const getActiveGoalId = async (): Promise<string | null> => {
  try {
    return await storage.getItem(ACTIVE_GOAL_ID_KEY);
  } catch (error) {
    console.error('활성 목표 ID 조회 실패:', error);
    return null;
  }
};

/**
 * 활성 목표 설정
 */
export const setActiveGoalId = async (goalId: string | null): Promise<boolean> => {
  try {
    if (goalId) {
      await storage.setItem(ACTIVE_GOAL_ID_KEY, goalId);
    } else {
      await storage.removeItem(ACTIVE_GOAL_ID_KEY);
    }
    return true;
  } catch (error) {
    console.error('활성 목표 설정 실패:', error);
    return false;
  }
};

/**
 * 활성 목표 조회
 */
export const getActiveGoal = async (): Promise<Goal | null> => {
  try {
    const activeGoalId = await getActiveGoalId();
    if (!activeGoalId) return null;
    
    const goals = await getGoals();
    return goals.find((g) => g.id === activeGoalId) || null;
  } catch (error) {
    console.error('활성 목표 조회 실패:', error);
    return null;
  }
};

// ===== 사용자 정보 관리 =====

/**
 * 사용자 정보 조회
 */
export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const data = await storage.getItem(USER_INFO_KEY);
    if (!data) {
      // 기본값: 비회원
      return { isGuest: true };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    return { isGuest: true };
  }
};

/**
 * 사용자 정보 저장
 */
export const saveUserInfo = async (userInfo: UserInfo): Promise<boolean> => {
  try {
    await storage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('사용자 정보 저장 실패:', error);
    return false;
  }
};

// ===== 테스트용 초기화 =====

/**
 * 모든 데이터 초기화 (테스트용)
 * 목표, 활성 목표 ID, 사용자 정보 모두 삭제
 */
export const clearAllData = async (): Promise<boolean> => {
  try {
    await storage.removeItem(GOALS_STORAGE_KEY);
    await storage.removeItem(ACTIVE_GOAL_ID_KEY);
    await storage.removeItem(USER_INFO_KEY);
    console.log('✅ 모든 데이터 초기화 완료');
    return true;
  } catch (error) {
    console.error('데이터 초기화 실패:', error);
    return false;
  }
};

