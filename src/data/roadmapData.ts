// AI가 생성하는 로드맵 기반 목업 데이터
// 실제 AI API 응답과 동일한 구조로 데이터 생성

import {
  Roadmap,
  Phase,
  ScheduleItem,
  User,
  Goal,
  GoalProgress,
  calculateGoalProgress,
  getCurrentPhase,
  getTodayScheduleItem,
} from "../types";

// ===== 5KM 달리기 로드맵 데이터 =====
export const running5KMRoadmap: Roadmap = {
  roadmap: [
    {
      phase: 1,
      phase_title: "준비 운동 및 기초 다지기",
      phase_description:
        "달리기를 위한 몸 상태를 만들고, 기본적인 체력을 향상시키는 단계입니다. 부상 방지를 위한 스트레칭과 근력 운동에 집중합니다.",
      key_milestones: [
        "가벼운 스트레칭 루틴 습득",
        "걷기-달리기 인터벌 훈련 시작",
        "코어 근육 강화 운동 시작",
      ],
    },
    {
      phase: 2,
      phase_title: "인터벌 훈련 강도 증가",
      phase_description:
        "점진적으로 달리는 시간과 거리를 늘려 심폐지구력을 향상시키는 단계입니다. 인터벌 훈련의 강도를 높여 달리기에 적응합니다.",
      key_milestones: [
        "인터벌 훈련 시간 증가",
        "최대 심박수 측정 및 활용",
        "달리기 자세 교정",
      ],
    },
    {
      phase: 3,
      phase_title: "지속주 훈련 및 거리 늘리기",
      phase_description:
        "일정한 속도로 꾸준히 달리는 지속주 훈련을 통해 지구력을 키우고, 달리는 거리를 점차 늘려 5km 완주에 대비합니다.",
      key_milestones: [
        "지속주 훈련 시작",
        "주당 달리는 거리 증가",
        "장거리 달리기 대비 영양 섭취 계획",
      ],
    },
    {
      phase: 4,
      phase_title: "5km 달리기 시뮬레이션",
      phase_description:
        "실제 5km 달리기를 모의로 진행하여 페이스 조절 능력을 향상시키고, 완주 전략을 수립합니다.",
      key_milestones: [
        "5km 달리기 시뮬레이션 2회 이상 실시",
        "개인별 페이스 조절 전략 수립",
        "대회 당일 환경 적응 훈련",
      ],
    },
    {
      phase: 5,
      phase_title: "5km 달리기 도전!",
      phase_description:
        "최상의 컨디션으로 5km 달리기에 도전하여 목표를 달성하고, 꾸준한 운동 습관을 유지합니다.",
      key_milestones: [
        "5km 달리기 완주",
        "개인 최고 기록 경신",
        "달리기 후 회복 루틴 실천",
      ],
    },
  ],
  schedule: [
    {
      week: 1,
      day: 1,
      phase_link: 1,
      activity_type: "Warm-up & Stretching",
      title: "가벼운 스트레칭 및 준비 운동",
      description:
        "목, 어깨, 팔, 허리, 다리 등 전신 스트레칭 (15분). 가볍게 걷기 (5분). 오늘부터 꾸준히 시작해봐요!",
    },
    {
      week: 1,
      day: 2,
      phase_link: 1,
      activity_type: "Walking & Light Jogging",
      title: "걷기-가벼운 조깅 인터벌",
      description:
        "걷기 3분 - 조깅 1분 - 걷기 3분 반복 (총 20분). 무리하지 말고 천천히 진행하세요!",
    },
    {
      week: 1,
      day: 3,
      phase_link: 1,
      activity_type: "Rest & Recovery",
      title: "휴식 및 가벼운 스트레칭",
      description:
        "오늘은 휴식! 몸의 피로를 풀어주는 가벼운 스트레칭으로 마무리하세요.",
    },
    {
      week: 2,
      day: 1,
      phase_link: 1,
      activity_type: "Warm-up & Stretching",
      title: "스트레칭 및 준비 운동",
      description:
        "전신 스트레칭 (15분), 가볍게 걷기 (5분). 몸이 점점 풀리는 것을 느껴보세요!",
    },
    {
      week: 2,
      day: 2,
      phase_link: 2,
      activity_type: "Interval Training",
      title: "걷기-조깅 인터벌 (강도 증가)",
      description:
        "걷기 2분 - 조깅 2분 - 걷기 2분 반복 (총 25분). 조금씩 강도를 올려보는 겁니다!",
    },
    {
      week: 2,
      day: 3,
      phase_link: 1,
      activity_type: "Core Strengthening",
      title: "코어 근육 강화 운동",
      description:
        "플랭크, 크런치, 레그 레이즈 각 15회씩 3세트. 코어는 달리기의 핵심!",
    },
    {
      week: 3,
      day: 1,
      phase_link: 2,
      activity_type: "Interval Training",
      title: "인터벌 훈련",
      description:
        "조깅 5분 - 빠른 속도로 달리기 1분 - 조깅 2분 (총 30분). 점점 더 힘이 넘치는 당신!",
    },
    {
      week: 3,
      day: 2,
      phase_link: 2,
      activity_type: "Endurance Run",
      title: "지속주 훈련 시작",
      description:
        "편안한 속도로 20분 지속적으로 달리기. 페이스 유지가 중요합니다!",
    },
    {
      week: 3,
      day: 3,
      phase_link: 1,
      activity_type: "Rest & Recovery",
      title: "휴식 및 가벼운 스트레칭",
      description: "충분한 휴식과 스트레칭으로 몸을 회복시키세요.",
    },
    {
      week: 4,
      day: 1,
      phase_link: 3,
      activity_type: "Endurance Run",
      title: "지속주 훈련",
      description: "편안한 속도로 30분 지속적으로 달리기. 거리를 늘려나갑시다.",
    },
    {
      week: 4,
      day: 2,
      phase_link: 3,
      activity_type: "Long Run",
      title: "장거리 달리기 도전",
      description: "5km 거리 천천히 달리기. 완주를 목표로!",
    },
    {
      week: 4,
      day: 3,
      phase_link: 1,
      activity_type: "Rest & Recovery",
      title: "휴식 및 가벼운 스트레칭",
      description: "충분한 휴식과 스트레칭으로 몸을 회복시키세요.",
    },
    {
      week: 5,
      day: 1,
      phase_link: 4,
      activity_type: "Simulation Run",
      title: "5km 달리기 시뮬레이션",
      description:
        "실제 5km를 달리는 것처럼 페이스를 조절하며 달려보세요. 완주 시간 측정!",
    },
    {
      week: 5,
      day: 2,
      phase_link: 3,
      activity_type: "Rest & Recovery",
      title: "가벼운 조깅 및 휴식",
      description: "가볍게 몸을 풀어주고 충분한 휴식을 취하세요.",
    },
    {
      week: 5,
      day: 3,
      phase_link: 1,
      activity_type: "Core Strengthening",
      title: "코어 근육 강화 운동",
      description:
        "플랭크, 크런치, 레그 레이즈 각 20회씩 3세트. 마지막 스퍼트를 위해!",
    },
    {
      week: 6,
      day: 1,
      phase_link: 5,
      activity_type: "Tapering",
      title: "가벼운 조깅 및 휴식",
      description: "2km 가볍게 조깅 후 충분한 휴식. 컨디션 조절에 집중하세요!",
    },
    {
      week: 6,
      day: 2,
      phase_link: 5,
      activity_type: "Race Preparation",
      title: "대회 준비",
      description:
        "5km 대회 전날, 필요한 물품을 챙기고 충분한 수면을 취하세요. 긴장 풀고 화이팅!",
    },
    {
      week: 6,
      day: 3,
      phase_link: 5,
      activity_type: "5K Race!",
      title: "5km 달리기 대회!",
      description:
        "드디어 5km 달리기 대회! 그동안 갈고 닦은 실력을 뽐내세요! 목표 달성!",
    },
  ],
};

// ===== 영어 회화 로드맵 데이터 =====
export const englishConversationRoadmap: Roadmap = {
  roadmap: [
    {
      phase: 1,
      phase_title: "기초 다지기: 영어 발음 및 기본 문장 구조 익히기",
      phase_description:
        "영어 발음 규칙을 이해하고, 기본적인 문장 구조(주어+동사, 주어+동사+목적어 등)를 익히는 단계입니다. 쉬운 영어 동화책 읽기 및 짧은 영어 비디오 시청을 통해 영어에 대한 흥미를 높입니다.",
      key_milestones: [
        "정확한 영어 발음 연습",
        "기본적인 영어 문장 구조 이해",
        "쉬운 영어 자료 읽고 듣기",
      ],
    },
    {
      phase: 2,
      phase_title: "어휘력 확장: 일상 생활 관련 어휘 및 표현 학습",
      phase_description:
        "일상 생활에서 자주 사용되는 어휘와 표현을 집중적으로 학습합니다. 플래시 카드, 온라인 퀴즈, 영어 단어 학습 앱 등을 활용하여 어휘력을 효과적으로 늘립니다.",
      key_milestones: [
        "일상 생활 관련 어휘 500개 이상 암기",
        "간단한 영어 문장으로 자기 소개 가능",
        "쇼핑, 음식 주문 등 기본적인 상황에서 영어 사용 가능",
      ],
    },
    {
      phase: 3,
      phase_title: "듣기 능력 향상: 짧은 대화 및 인터뷰 듣고 이해하기",
      phase_description:
        "짧은 영어 대화나 인터뷰를 듣고 내용을 이해하는 연습을 합니다. 팟캐스트, 뉴스 클립, 영어 학습 앱 등을 활용하여 다양한 억양과 발음에 익숙해집니다.",
      key_milestones: [
        "짧은 영어 대화 70% 이상 이해",
        "뉴스 클립의 핵심 내용 파악",
        "영어 팟캐스트 듣고 주요 정보 습득",
      ],
    },
    {
      phase: 4,
      phase_title: "말하기 연습: 간단한 주제에 대해 영어로 말하기",
      phase_description:
        "배운 어휘와 표현을 활용하여 간단한 주제에 대해 영어로 말하는 연습을 합니다. 영어 스터디 그룹 참여, 온라인 튜터 활용, 혼자서 역할극 등을 통해 자신감을 키웁니다.",
      key_milestones: [
        "자신감 있게 영어로 말하기",
        "간단한 질문에 영어로 답변",
        "일상적인 주제에 대해 3분 이상 영어로 대화",
      ],
    },
    {
      phase: 5,
      phase_title: "실전 회화: 외국인과의 대화 시도 및 피드백",
      phase_description:
        "외국인과의 대화에 적극적으로 참여하여 실제 회화 능력을 향상시킵니다. 언어 교환 앱, 외국인 친구 사귀기, 해외 여행 등을 통해 실전 경험을 쌓습니다.",
      key_milestones: [
        "외국인과의 대화에 두려움 극복",
        "자신의 생각을 영어로 효과적으로 전달",
        "피드백을 통해 영어 실력 지속적으로 향상",
      ],
    },
  ],
  schedule: [
    {
      week: 1,
      day: 1,
      phase_link: 1,
      activity_type: "발음 연습",
      title: "영어 발음 집중 훈련 (기초)",
      description:
        "파닉스 규칙 학습 및 주요 발음 연습 (예: th, r, l). 혀와 입술 모양에 집중하며 따라하세요! 잘하고 있어요!",
    },
    {
      week: 1,
      day: 2,
      phase_link: 1,
      activity_type: "기본 문장 학습",
      title: "가장 쉬운 영어 문장 만들기",
      description:
        "주어 + 동사 문장 연습 (예: I go, She eats). 문장 구조를 이해하는 것이 중요합니다. 힘내세요!",
    },
    {
      week: 1,
      day: 3,
      phase_link: 1,
      activity_type: "영어 동화 읽기",
      title: "재미있는 영어 동화 읽기",
      description:
        "쉬운 영어 동화책 1챕터 읽기. 모르는 단어는 체크하고 넘어가세요. 아주 잘하고 있습니다!",
    },
    {
      week: 1,
      day: 4,
      phase_link: 2,
      activity_type: "어휘 학습",
      title: "필수 어휘 암기 (일상생활)",
      description:
        "일상생활 관련 영어 단어 20개 암기. 플래시 카드 활용. 꾸준함이 중요합니다!",
    },
    {
      week: 2,
      day: 1,
      phase_link: 2,
      activity_type: "어휘 복습",
      title: "지난주 학습 어휘 복습 및 퀴즈",
      description:
        "지난주에 배운 단어들을 복습하고 온라인 퀴즈를 풀어보세요. 기억력을 향상시킬 수 있습니다.",
    },
    {
      week: 2,
      day: 2,
      phase_link: 2,
      activity_type: "문장 만들기 연습",
      title: "어휘를 활용한 문장 만들기",
      description:
        "배운 어휘를 사용하여 자신만의 문장을 만들어 보세요. 창의력을 발휘하세요!",
    },
    {
      week: 2,
      day: 3,
      phase_link: 3,
      activity_type: "듣기 연습",
      title: "짧은 영어 대화 듣고 이해하기",
      description:
        "5분 내외의 영어 대화를 듣고 주요 내용을 파악하세요. 처음에는 잘 안 들려도 괜찮습니다.",
    },
    {
      week: 2,
      day: 4,
      phase_link: 3,
      activity_type: "받아쓰기 연습",
      title: "영어 대화 받아쓰기",
      description:
        "들었던 영어 대화를 받아쓰고 스크립트와 비교해 보세요. 듣기 실력이 향상됩니다.",
    },
    {
      week: 3,
      day: 1,
      phase_link: 3,
      activity_type: "영어 뉴스 시청",
      title: "간단한 영어 뉴스 시청",
      description:
        "어린이용 영어 뉴스 또는 쉬운 영어 뉴스를 시청하세요. 배경 지식을 쌓을 수 있습니다.",
    },
    {
      week: 3,
      day: 2,
      phase_link: 4,
      activity_type: "말하기 연습",
      title: "자기소개 연습 (영어)",
      description:
        "자신을 소개하는 연습을 영어로 해보세요. 거울을 보고 연습하면 더욱 효과적입니다.",
    },
    {
      week: 3,
      day: 3,
      phase_link: 4,
      activity_type: "질문 답변 연습",
      title: "간단한 질문에 영어로 답하기",
      description:
        "예상 질문 리스트를 만들고 영어로 답변하는 연습을 하세요. 자신감을 키울 수 있습니다.",
    },
    {
      week: 3,
      day: 4,
      phase_link: 4,
      activity_type: "역할극",
      title: "일상 생활 역할극 (영어)",
      description:
        "쇼핑, 음식 주문 등 일상 생활에서 일어날 수 있는 상황을 설정하고 역할극을 해보세요.",
    },
    {
      week: 4,
      day: 1,
      phase_link: 5,
      activity_type: "언어 교환 앱 사용",
      title: "언어 교환 앱으로 외국인 친구 만들기",
      description:
        "언어 교환 앱을 이용하여 외국인 친구를 만들고 영어로 대화하세요.",
    },
    {
      week: 4,
      day: 2,
      phase_link: 5,
      activity_type: "온라인 영어 튜터 활용",
      title: "온라인 영어 튜터와 프리토킹",
      description:
        "온라인 영어 튜터를 이용하여 자유롭게 영어로 대화하세요. 피드백을 받을 수 있습니다.",
    },
    {
      week: 4,
      day: 3,
      phase_link: 5,
      activity_type: "피드백 반영",
      title: "튜터 피드백을 바탕으로 개선",
      description:
        "온라인 튜터에게 받은 피드백을 바탕으로 부족한 부분을 보완하세요.",
    },
    {
      week: 4,
      day: 4,
      phase_link: 1,
      activity_type: "발음 교정",
      title: "AI 발음 교정 도구 사용",
      description:
        "AI 발음 교정 도구를 사용하여 발음을 교정하세요. 잘못된 발음을 정확하게 파악할 수 있습니다.",
    },
    {
      week: 5,
      day: 1,
      phase_link: 2,
      activity_type: "영단어 복습 퀴즈",
      title: "어플을 이용한 영단어 복습",
      description:
        "본인이 사용하는 영단어 어플을 이용하여 복습 퀴즈를 풀어보세요.",
    },
    {
      week: 5,
      day: 2,
      phase_link: 3,
      activity_type: "영어 쉐도잉",
      title: "짧은 영어 뉴스 쉐도잉",
      description:
        "짧은 영어 뉴스를 들으면서 동시에 따라 말해보세요. 억양과 발음을 교정할 수 있습니다.",
    },
    {
      week: 5,
      day: 3,
      phase_link: 4,
      activity_type: "영어 일기 쓰기",
      title: "오늘 하루 영어로 일기 쓰기",
      description:
        "오늘 하루 있었던 일을 간단하게 영어로 써보세요. 문장구조와 어휘 사용에 도움이 됩니다.",
    },
    {
      week: 5,
      day: 4,
      phase_link: 5,
      activity_type: "오픈채팅 영어 스터디 참여",
      title: "오픈채팅 영어 스터디 참여",
      description:
        "온라인 영어 스터디에 참여하여 다양한 사람들과 영어로 대화해보세요.",
    },
    {
      week: 6,
      day: 1,
      phase_link: 1,
      activity_type: "총 복습",
      title: "6주간 배운 내용 총 복습",
      description:
        "지난 6주간 배운 모든 내용을 복습하고, 부족한 부분을 다시 학습하세요.",
    },
    {
      week: 6,
      day: 2,
      phase_link: 2,
      activity_type: "실력 점검 퀴즈",
      title: "온라인 영어 실력 점검 퀴즈",
      description:
        "온라인 영어 실력 점검 퀴즈를 풀고 자신의 실력을 평가해보세요.",
    },
    {
      week: 6,
      day: 3,
      phase_link: 3,
      activity_type: "마무리",
      title: "영어 학습 마무리 및 향후 계획",
      description:
        "향후 영어 학습 계획을 세우고, 꾸준히 영어 공부를 이어가세요!",
    },
    {
      week: 6,
      day: 4,
      phase_link: 4,
      activity_type: "자신감 향상",
      title: "스스로에게 칭찬하기",
      description:
        "지난 6주간의 노력을 스스로 칭찬하고, 앞으로도 꾸준히 노력하세요!",
    },
  ],
};

// ===== 다중 목표 사용자 데이터 생성 =====
export const createMockUserWithMultipleGoals = (): User => {
  const runningGoal: Goal = {
    id: "goal-running-5km",
    title: "5KM 달리기 완주",
    description: "6주 동안 체계적인 훈련을 통해 5KM 달리기를 완주하는 목표",
    status: "active",
    priority: 1,
    createdAt: new Date("2024-01-01"),
    roadmap: running5KMRoadmap,
    progress: {
      currentPhase: 1,
      completedPhases: [],
      completedScheduleItems: [],
      totalProgress: 0,
      consecutiveDays: 0,
    },
  };

  const englishGoal: Goal = {
    id: "goal-english-conversation",
    title: "영어 회화 능력 향상",
    description:
      "6주 동안 체계적인 학습을 통해 영어 회화 능력을 향상시키는 목표",
    status: "active",
    priority: 2,
    createdAt: new Date("2024-01-15"),
    roadmap: englishConversationRoadmap,
    progress: {
      currentPhase: 1,
      completedPhases: [],
      completedScheduleItems: [],
      totalProgress: 0,
      consecutiveDays: 0,
    },
  };

  return {
    id: "user-1",
    name: "김철수",
    goals: [runningGoal, englishGoal],
    activeGoalId: "goal-running-5km", // 기본적으로 달리기 목표를 활성화
    level: 1,
    consecutiveDays: 0,
    totalSteps: 20,
    completedSteps: 0,
  };
};

// ===== 유틸리티 함수들 =====
export const getGoalById = (user: User, goalId: string): Goal | undefined => {
  return user.goals.find((goal) => goal.id === goalId);
};

export const getActiveGoal = (user: User): Goal | undefined => {
  return getGoalById(user, user.activeGoalId);
};

export const updateGoalProgress = (
  goal: Goal,
  completedItemId: string
): Goal => {
  const updatedProgress = {
    ...goal.progress,
    completedScheduleItems: [
      ...goal.progress.completedScheduleItems,
      completedItemId,
    ],
    totalProgress: calculateGoalProgress({
      ...goal,
      progress: {
        ...goal.progress,
        completedScheduleItems: [
          ...goal.progress.completedScheduleItems,
          completedItemId,
        ],
      },
    }),
  };

  return {
    ...goal,
    progress: updatedProgress,
  };
};

export const switchActiveGoal = (user: User, newActiveGoalId: string): User => {
  const goalExists = user.goals.some((goal) => goal.id === newActiveGoalId);
  if (!goalExists) {
    throw new Error(`Goal with id ${newActiveGoalId} not found`);
  }

  return {
    ...user,
    activeGoalId: newActiveGoalId,
  };
};

// ===== 목업 데이터 export =====
export const mockUserWithMultipleGoals = createMockUserWithMultipleGoals();

// ===== 추가 유틸리티 함수들 export =====
export {
  calculateGoalProgress,
  getCurrentPhase,
  getTodayScheduleItem,
} from "../types";
