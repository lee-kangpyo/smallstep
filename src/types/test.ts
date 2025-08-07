// 타입 정의 및 타입 가드 함수 테스트
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
} from "./index";

// 테스트용 데이터
const testPhase: Phase = {
  phase: 1,
  phase_title: "테스트 단계",
  phase_description: "테스트용 단계 설명",
  key_milestones: ["마일스톤 1", "마일스톤 2"],
};

const testScheduleItem: ScheduleItem = {
  week: 1,
  day: 1,
  phase_link: 1,
  activity_type: "테스트 활동",
  title: "테스트 제목",
  description: "테스트 설명",
};

const testRoadmap: Roadmap = {
  roadmap: [testPhase],
  schedule: [testScheduleItem],
};

const testGoalProgress: GoalProgress = {
  currentPhase: 1,
  completedPhases: [],
  completedScheduleItems: [],
  totalProgress: 0,
  consecutiveDays: 0,
};

const testGoal: Goal = {
  id: "test-goal-1",
  title: "테스트 목표",
  description: "테스트 목표 설명",
  status: "active",
  priority: 1,
  createdAt: new Date(),
  roadmap: testRoadmap,
  progress: testGoalProgress,
};

const testUser: User = {
  id: "test-user-1",
  name: "테스트 사용자",
  goals: [testGoal],
  activeGoalId: "test-goal-1",
  level: 1,
  consecutiveDays: 0,
  totalSteps: 10,
  completedSteps: 0,
};

// 타입 가드 함수 테스트
export const testTypeGuards = () => {
  console.log("=== 타입 가드 함수 테스트 ===");

  // isPhase 테스트
  console.log("isPhase(testPhase):", isPhase(testPhase)); // true
  console.log("isPhase({}):", isPhase({})); // false

  // isScheduleItem 테스트
  console.log(
    "isScheduleItem(testScheduleItem):",
    isScheduleItem(testScheduleItem)
  ); // true
  console.log("isScheduleItem({}):", isScheduleItem({})); // false

  // isRoadmap 테스트
  console.log("isRoadmap(testRoadmap):", isRoadmap(testRoadmap)); // true
  console.log("isRoadmap({}):", isRoadmap({})); // false

  // isGoalProgress 테스트
  console.log(
    "isGoalProgress(testGoalProgress):",
    isGoalProgress(testGoalProgress)
  ); // true
  console.log("isGoalProgress({}):", isGoalProgress({})); // false

  // isGoal 테스트
  console.log("isGoal(testGoal):", isGoal(testGoal)); // true
  console.log("isGoal({}):", isGoal({})); // false
};

// 유틸리티 함수 테스트
export const testUtilityFunctions = () => {
  console.log("=== 유틸리티 함수 테스트 ===");

  // calculateGoalProgress 테스트
  console.log(
    "calculateGoalProgress(testGoal):",
    calculateGoalProgress(testGoal)
  ); // 0

  // getCurrentPhase 테스트
  const currentPhase = getCurrentPhase(testGoal);
  console.log("getCurrentPhase(testGoal):", currentPhase); // testPhase

  // getTodayScheduleItem 테스트
  const todayItem = getTodayScheduleItem(testGoal);
  console.log("getTodayScheduleItem(testGoal):", todayItem); // null 또는 해당하는 아이템
};

// 전체 테스트 실행
export const runAllTests = () => {
  testTypeGuards();
  testUtilityFunctions();
  console.log("=== 모든 테스트 완료 ===");
};

// TypeScript 컴파일 확인을 위한 export
export {
  testPhase,
  testScheduleItem,
  testRoadmap,
  testGoalProgress,
  testGoal,
  testUser,
};
