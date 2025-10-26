// SmallStep 온보딩 목업 데이터
// 블루프린트의 디자인 설계안에 따른 데이터 구조

// 새로운 타입들 import
import {
  Roadmap,
  Phase,
  ScheduleItem,
  User,
  Goal,
  GoalProgress,
  isRoadmap,
  isPhase,
  isScheduleItem,
  isGoal,
  isGoalProgress,
  calculateGoalProgress,
  getCurrentPhase,
  getTodayScheduleItem,
  convertSmallStepToScheduleItem,
  convertGoalAnalysisToRoadmap,
} from "../types";

// 새로운 로드맵 데이터 import
import {
  running5KMRoadmap,
  englishConversationRoadmap,
  mockUserWithMultipleGoals,
  getGoalById,
  getActiveGoal,
  updateGoalProgress,
  switchActiveGoal,
} from "./roadmapData";

export interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  illustration?: string; // 나중에 이미지 추가 예정
}

// 기존 SmallStep 인터페이스를 새로운 타입과 호환되도록 확장
export interface SmallStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  // 새로운 필드들 (기존 구조와의 호환성을 위해 optional)
  phaseLink?: number;
  scheduleItemId?: string;
}

// 기존 GoalAnalysis 인터페이스를 새로운 타입과 호환되도록 확장
export interface GoalAnalysis {
  originalGoal: string;
  smallSteps: SmallStep[];
  totalEstimatedTime: string;
  aiMessage: string;
  // 새로운 필드들 (기존 구조와의 호환성을 위해 optional)
  roadmap?: Roadmap;
}

// 기존 UserData를 새로운 User 타입과 호환되도록 확장
export interface UserData {
  id: string;
  name: string;
  level: number;
  consecutiveDays: number;
  totalSteps: number;
  completedSteps: number;
  currentGoal: string;
  // 새로운 필드들 (기존 구조와의 호환성을 위해 optional)
  goals?: Goal[];
  activeGoalId?: string;
}

// 오늘의 스텝 데이터
export interface TodayStep {
  step: SmallStep;
  isCompleted: boolean;
  completedAt?: Date;
}

// 새로운 타입들도 export
export type { Roadmap, Phase, ScheduleItem, User, Goal, GoalProgress };

// 새로운 유틸리티 함수들도 export
export {
  isRoadmap,
  isPhase,
  isScheduleItem,
  isGoal,
  isGoalProgress,
  calculateGoalProgress,
  getCurrentPhase,
  getTodayScheduleItem,
  convertSmallStepToScheduleItem,
  convertGoalAnalysisToRoadmap,
};

// 온보딩 슬라이드 데이터
export const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: "계획 짜기 어려우신가요?",
    subtitle: "AI가 대신 해드려요",
    description:
      "목표만 말하면 계획을 짜드릴게요!",
  },
  {
    id: 2,
    title: "목표를 실행 계획으로",
    subtitle: "오늘부터 할 수 있어요",
    description:
      "구체적인 단계별 계획",
  },
  {
    id: 3,
    title: "매일 한 걸음씩",
    subtitle: "꾸준히 성장해요",
    description: "작은 성취의 기쁨",
  },
];

// 예시 목표 분석 데이터
export const mockGoalAnalysis: GoalAnalysis = {
  originalGoal: "토익 900점 달성",
  smallSteps: [
    {
      id: "1",
      title: "내일 볼 단어 10개 포스트잇에 적어두기",
      description: "출퇴근길에 볼 수 있도록 포스트잇에 핵심 단어를 적어두세요.",
      estimatedTime: "5분",
      difficulty: "easy",
      category: "단어 학습",
    },
    {
      id: "2",
      title: "출퇴근길에 영어 뉴스 5분 듣기",
      description: "버스나 지하철에서 영어 뉴스 팟캐스트를 들어보세요.",
      estimatedTime: "5분",
      difficulty: "easy",
      category: "리스닝",
    },
    {
      id: "3",
      title: "점심시간 후 계단으로 5층까지 오르기",
      description:
        "건강도 챙기고 영어 공부도 함께! 계단 오르며 영어 단어를 외워보세요.",
      estimatedTime: "10분",
      difficulty: "medium",
      category: "건강 + 학습",
    },
    {
      id: "4",
      title: "저녁에 토익 문제 1개 풀기",
      description: "하루에 한 문제씩, 부담 없이 토익 문제를 풀어보세요.",
      estimatedTime: "15분",
      difficulty: "medium",
      category: "문제 풀이",
    },
    {
      id: "5",
      title: "주말에 영어 영화 30분 보기",
      description: "자막 없이 영어 영화를 보며 자연스럽게 영어에 노출되세요.",
      estimatedTime: "30분",
      difficulty: "hard",
      category: "영화 감상",
    },
  ],
  totalEstimatedTime: "65분",
  aiMessage:
    "토익 900점 달성이라는 큰 목표를 5개의 작은 행동으로 나누어드렸어요. 하루에 하나씩 시작해보세요!",
};

// 카테고리별 색상 매핑
export const categoryColors = {
  "단어 학습": "#FF6F61", // Coral Pink
  리스닝: "#008080", // Deep Mint
  "건강 + 학습": "#FF8C00", // Warm Orange
  "문제 풀이": "#ADD8E6", // Light Blue
  "영화 감상": "#28A745", // Success Green
};

// 목업 사용자 데이터
export const mockUserData: UserData = {
  id: "user1",
  name: "김민지",
  level: 3,
  consecutiveDays: 7,
  totalSteps: 25,
  completedSteps: 18,
  currentGoal: "토익 900점 달성",
};

// 오늘의 스텝 데이터
export const mockTodayStep: TodayStep = {
  step: {
    id: "today1",
    title: "출퇴근길에 영어 뉴스 5분 듣기",
    description:
      "버스나 지하철에서 영어 뉴스 팟캐스트를 들어보세요. 자연스럽게 영어에 노출되는 시간을 만들어요.",
    estimatedTime: "5분",
    difficulty: "easy",
    category: "리스닝",
  },
  isCompleted: false,
};

// 격려 메시지 데이터
export const getEncouragementMessage = (consecutiveDays: number) => {
  if (consecutiveDays === 0) {
    return "오늘부터 시작해보세요! 첫 걸음이 가장 중요해요 💪";
  } else if (consecutiveDays <= 3) {
    return `좋아요! ${consecutiveDays}일째 계속되고 있어요 🌱`;
  } else if (consecutiveDays <= 7) {
    return `대단해요! ${consecutiveDays}일 연속으로 꾸준히 하고 있어요 🌿`;
  } else if (consecutiveDays <= 14) {
    return `놀라워요! ${consecutiveDays}일째 습관이 자리잡고 있어요 🌳`;
  } else {
    return `완벽해요! ${consecutiveDays}일 연속으로 당신은 이미 달라졌어요 🌲`;
  }
};

// 배지 시스템
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  isUnlocked: boolean;
  unlockedAt?: Date;
}

export const mockBadges: Badge[] = [
  {
    id: "first-step",
    name: "첫 걸음",
    description: "첫 번째 스텝을 완료했습니다",
    icon: "👣",
    condition: "첫 스텝 완료",
    isUnlocked: true,
    unlockedAt: new Date("2025-08-01"),
  },
  {
    id: "streak-3",
    name: "꾸준함",
    description: "3일 연속 성공",
    icon: "🔥",
    condition: "3일 연속 성공",
    isUnlocked: true,
    unlockedAt: new Date("2025-08-03"),
  },
  {
    id: "streak-7",
    name: "일주일의 기적",
    description: "7일 연속 성공",
    icon: "⭐",
    condition: "7일 연속 성공",
    isUnlocked: false,
  },
  {
    id: "streak-30",
    name: "한 달의 습관",
    description: "30일 연속 성공",
    icon: "🏆",
    condition: "30일 연속 성공",
    isUnlocked: false,
  },
  {
    id: "perfect-week",
    name: "완벽한 한 주",
    description: "한 주 동안 모든 스텝 완료",
    icon: "💎",
    condition: "한 주 완벽 성공",
    isUnlocked: false,
  },
  {
    id: "early-bird",
    name: "아침형 인간",
    description: "아침에 스텝을 완료",
    icon: "🌅",
    condition: "아침 시간대 완료",
    isUnlocked: false,
  },
];

// 레벨 시스템
export interface Level {
  level: number;
  title: string;
  requiredExp: number;
  reward: string;
}

export const mockLevels: Level[] = [
  { level: 1, title: "새싹", requiredExp: 0, reward: "기본 캐릭터" },
  { level: 2, title: "새싹", requiredExp: 10, reward: "잎사귀 추가" },
  { level: 3, title: "새싹", requiredExp: 25, reward: "꽃봉오리" },
  { level: 4, title: "꽃", requiredExp: 50, reward: "꽃잎 추가" },
  { level: 5, title: "꽃", requiredExp: 100, reward: "향기 효과" },
  { level: 6, title: "나무", requiredExp: 200, reward: "나뭇가지" },
  { level: 7, title: "나무", requiredExp: 400, reward: "그림자 효과" },
  { level: 8, title: "정원", requiredExp: 800, reward: "다른 식물들" },
  { level: 9, title: "정원", requiredExp: 1600, reward: "나비 효과" },
  { level: 10, title: "숲", requiredExp: 3200, reward: "완전한 생태계" },
];

// 사용자 게임 데이터
export interface UserGameData {
  level: number;
  experience: number;
  totalSteps: number;
  completedSteps: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  lastCompletedDate?: Date;
}

export const mockUserGameData: UserGameData = {
  level: 3,
  experience: 35,
  totalSteps: 25,
  completedSteps: 18,
  currentStreak: 7,
  longestStreak: 12,
  badges: mockBadges.filter((badge) => badge.isUnlocked),
  lastCompletedDate: new Date("2025-08-04"),
};

// 경험치 계산 함수
export const calculateExperience = (
  completedSteps: number,
  streak: number
): number => {
  return completedSteps * 2 + streak * 5;
};

// 레벨 계산 함수
export const calculateLevel = (experience: number): number => {
  const level = mockLevels.find((level) => experience < level.requiredExp);
  return level ? level.level - 1 : mockLevels.length;
};

// 배지 해금 조건 확인
export const checkBadgeUnlock = (userData: UserGameData): Badge[] => {
  const newBadges: Badge[] = [];

  // 첫 걸음 배지
  if (
    userData.completedSteps >= 1 &&
    !userData.badges.find((b) => b.id === "first-step")
  ) {
    newBadges.push({
      ...mockBadges.find((b) => b.id === "first-step")!,
      isUnlocked: true,
      unlockedAt: new Date(),
    });
  }

  // 연속 성공 배지들
  if (
    userData.currentStreak >= 3 &&
    !userData.badges.find((b) => b.id === "streak-3")
  ) {
    newBadges.push({
      ...mockBadges.find((b) => b.id === "streak-3")!,
      isUnlocked: true,
      unlockedAt: new Date(),
    });
  }

  if (
    userData.currentStreak >= 7 &&
    !userData.badges.find((b) => b.id === "streak-7")
  ) {
    newBadges.push({
      ...mockBadges.find((b) => b.id === "streak-7")!,
      isUnlocked: true,
      unlockedAt: new Date(),
    });
  }

  return newBadges;
};

// 새로운 로드맵 데이터 export
export {
  running5KMRoadmap,
  englishConversationRoadmap,
  mockUserWithMultipleGoals,
  getGoalById,
  getActiveGoal,
  updateGoalProgress,
  switchActiveGoal,
};

// 기존 데이터와 새로운 데이터를 통합한 사용자 데이터
export const mockUserDataWithRoadmap: UserData = {
  ...mockUserData,
  goals: mockUserWithMultipleGoals.goals,
  activeGoalId: mockUserWithMultipleGoals.activeGoalId,
};
