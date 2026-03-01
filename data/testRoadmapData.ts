// 로드맵 데이터 테스트
import {
  running5KMRoadmap,
  englishConversationRoadmap,
  mockUserWithMultipleGoals,
  getGoalById,
  getActiveGoal,
  updateGoalProgress,
  switchActiveGoal,
  calculateGoalProgress,
  getCurrentPhase,
  getTodayScheduleItem,
} from "./roadmapData";

// 테스트 함수들
export const testRoadmapData = () => {
  console.log("=== 로드맵 데이터 테스트 ===");

  // 1. 로드맵 데이터 구조 확인
  console.log("5KM 달리기 로드맵 단계 수:", running5KMRoadmap.roadmap.length);
  console.log(
    "5KM 달리기 스케줄 아이템 수:",
    running5KMRoadmap.schedule.length
  );
  console.log(
    "영어 회화 로드맵 단계 수:",
    englishConversationRoadmap.roadmap.length
  );
  console.log(
    "영어 회화 스케줄 아이템 수:",
    englishConversationRoadmap.schedule.length
  );

  // 2. 다중 목표 사용자 데이터 확인
  console.log("사용자 목표 수:", mockUserWithMultipleGoals.goals.length);
  console.log("활성 목표 ID:", mockUserWithMultipleGoals.activeGoalId);

  // 3. 목표 조회 함수 테스트
  const activeGoal = getActiveGoal(mockUserWithMultipleGoals);
  console.log("활성 목표:", activeGoal?.title);

  const runningGoal = getGoalById(
    mockUserWithMultipleGoals,
    "goal-running-5km"
  );
  console.log("달리기 목표:", runningGoal?.title);

  // 4. 목표 진행률 계산 테스트
  if (runningGoal) {
    const progress = calculateGoalProgress(runningGoal);
    console.log("달리기 목표 진행률:", progress + "%");

    const currentPhase = getCurrentPhase(runningGoal);
    console.log("현재 단계:", currentPhase?.phase_title);

    const todayItem = getTodayScheduleItem(runningGoal);
    console.log("오늘의 활동:", todayItem?.title);
  }

  // 5. 목표 전환 테스트
  try {
    const switchedUser = switchActiveGoal(
      mockUserWithMultipleGoals,
      "goal-english-conversation"
    );
    console.log("목표 전환 후 활성 목표:", switchedUser.activeGoalId);
  } catch (error) {
    console.log("목표 전환 에러:", error);
  }

  // 6. 진행률 업데이트 테스트
  if (runningGoal) {
    const updatedGoal = updateGoalProgress(runningGoal, "test-completed-item");
    console.log(
      "업데이트 후 진행률:",
      calculateGoalProgress(updatedGoal) + "%"
    );
  }

  console.log("=== 테스트 완료 ===");
};

// 데이터 구조 검증 함수
export const validateRoadmapData = () => {
  console.log("=== 데이터 구조 검증 ===");

  // 로드맵 구조 검증
  const runningPhases = running5KMRoadmap.roadmap;
  const runningSchedule = running5KMRoadmap.schedule;

  console.log("달리기 로드맵 검증:");
  console.log("- 단계 수:", runningPhases.length);
  console.log("- 스케줄 아이템 수:", runningSchedule.length);
  console.log("- 첫 번째 단계:", runningPhases[0]?.phase_title);
  console.log("- 첫 번째 스케줄:", runningSchedule[0]?.title);

  // 사용자 데이터 검증
  const user = mockUserWithMultipleGoals;
  console.log("사용자 데이터 검증:");
  console.log("- 사용자 이름:", user.name);
  console.log("- 목표 수:", user.goals.length);
  console.log("- 활성 목표:", user.activeGoalId);

  // 각 목표 검증
  user.goals.forEach((goal, index) => {
    console.log(`목표 ${index + 1}:`);
    console.log(`- 제목: ${goal.title}`);
    console.log(`- 상태: ${goal.status}`);
    console.log(`- 진행률: ${goal.progress.totalProgress}%`);
    console.log(`- 현재 단계: ${goal.progress.currentPhase}`);
  });

  console.log("=== 검증 완료 ===");
};

// 전체 테스트 실행
export const runAllRoadmapTests = () => {
  testRoadmapData();
  validateRoadmapData();
};
