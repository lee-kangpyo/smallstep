import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CurrentPhaseCard } from "../components/CurrentPhaseCard";
import { ActiveGoalSelector } from "../components/ActiveGoalSelector";
import { ScheduleItemCard } from "../components/ScheduleItemCard";
import { GrowingCharacter } from "../components/GrowingCharacter";
import { BadgeCard } from "../components/BadgeCard";
import { LevelUpAnimation } from "../components/LevelUpAnimation";
import { useHapticFeedback } from "../hooks/useHapticFeedback";
import { useGoalStore, useUserStore, useActivityStore } from "../stores";
import {
  getEncouragementMessage,
  mockBadges,
  checkBadgeUnlock,
  calculateExperience,
  calculateLevel,
} from "../data/mockData";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

export const HomeScreen: React.FC = () => {
  // 전역 상태 사용
  const { goals, activeGoalId, setActiveGoal, getActiveGoal } = useGoalStore();

  const {
    userData,
    userGameData,
    completeStep,
    updateUserData,
    updateGameData,
  } = useUserStore();

  const {
    todayActivities,
    completedActivities,
    currentPhase,
    setTodayActivities,
    setCompletedActivities,
    completeActivity,
    setCurrentPhase,
  } = useActivityStore();

  // 로컬 상태
  const [isCharacterGrowing, setIsCharacterGrowing] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  const { triggerSuccess, triggerMedium } = useHapticFeedback();

  // 활성 목표 변경
  const handleGoalSelect = (goalId: string) => {
    setActiveGoal(goalId);
    // 새로운 목표에 맞는 현재 단계와 오늘 활동 로드
    loadGoalData(goalId);
  };

  // 목표 데이터 로드
  const loadGoalData = (goalId: string) => {
    const selectedGoal = goals.find((g) => g.id === goalId);
    if (selectedGoal && selectedGoal.roadmap) {
      // 현재 단계 찾기
      const currentPhaseIndex = selectedGoal.progress.currentPhase - 1;
      const roadmap = selectedGoal.roadmap.roadmap || [];
      if (roadmap[currentPhaseIndex]) {
        setCurrentPhase(roadmap[currentPhaseIndex]);
      }

      // 오늘의 활동 찾기 (간단한 시뮬레이션)
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = 일요일
      const mockTodayActivities = [
        {
          week: 1,
          day: dayOfWeek + 1,
          phase_link: 1,
          title: "오늘의 첫 번째 활동",
          description: "오늘 해야 할 첫 번째 활동입니다.",
          activity_type: "학습",
        },
        {
          week: 1,
          day: dayOfWeek + 1,
          phase_link: 1,
          title: "오늘의 두 번째 활동",
          description: "오늘 해야 할 두 번째 활동입니다.",
          activity_type: "실습",
        },
      ];
      setTodayActivities(mockTodayActivities);
    }
  };

  // 활동 완료 처리
  const handleActivityComplete = (activityId: string) => {
    triggerSuccess();
    triggerMedium();

    // 활동 완료 상태 업데이트
    completeActivity(activityId);

    // 게임 데이터 업데이트
    completeStep();

    // 레벨업 체크 (임시 로직)
    const newLevel = userGameData.level + 1;
    if (newLevel > userGameData.level) {
      setNewLevel(newLevel);
      setShowLevelUp(true);
    }

    // 캐릭터 성장 애니메이션 시작
    setIsCharacterGrowing(true);

    Alert.alert("축하해요! 🎉", "활동을 완료했어요! 한 걸음 더 나아갔네요.", [
      { text: "확인", style: "default" },
    ]);
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (activeGoalId) {
      loadGoalData(activeGoalId);
    }
  }, [activeGoalId]);

  // 스텝 완료 처리 (기존 함수 유지)
  const handleStepComplete = () => {
    // 햅틱 피드백
    triggerSuccess();
    triggerMedium();

    // 게임 데이터 업데이트
    const newCompletedSteps = userGameData.completedSteps + 1;
    const newStreak = userGameData.currentStreak + 1;
    const newExperience = calculateExperience(newCompletedSteps, newStreak);
    const newLevel = calculateLevel(newExperience);

    // 레벨업 체크
    if (newLevel > userGameData.level) {
      setNewLevel(newLevel);
      setShowLevelUp(true);
    }

    updateGameData({
      completedSteps: newCompletedSteps,
      currentStreak: newStreak,
      experience: newExperience,
      level: newLevel,
      lastCompletedDate: new Date(),
    });

    // 사용자 데이터 업데이트
    updateUserData({
      consecutiveDays: userData.consecutiveDays + 1,
      completedSteps: userData.completedSteps + 1,
      level: userData.level + 1,
    });

    // 캐릭터 성장 애니메이션 시작
    setIsCharacterGrowing(true);

    // 완료 알림
    Alert.alert(
      "축하해요! 🎉",
      "오늘의 스텝을 완료했어요! 한 걸음 더 나아갔네요.",
      [{ text: "확인", style: "default" }]
    );
  };

  // 캐릭터 성장 완료 처리
  const handleGrowthComplete = () => {
    setIsCharacterGrowing(false);
  };

  // 레벨업 애니메이션 완료 처리
  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.greeting}>안녕하세요, {userData.name}님! 👋</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </Text>
        </View>

        {/* 연속 성공일 표시 */}
        <View style={styles.streakContainer}>
          <Text style={styles.streakTitle}>🔥 연속 성공일</Text>
          <Text style={styles.streakCount}>{userData.consecutiveDays}일</Text>
          <Text style={styles.encouragementMessage}>
            {getEncouragementMessage(userData.consecutiveDays)}
          </Text>
        </View>

        {/* 캐릭터 성장 */}
        <View style={styles.characterSection}>
          <GrowingCharacter
            level={userData.level}
            isGrowing={isCharacterGrowing}
            onGrowthComplete={handleGrowthComplete}
          />
        </View>

        {/* 활성 목표 선택 */}
        <View style={styles.goalSection}>
          <ActiveGoalSelector
            goals={goals}
            activeGoalId={activeGoalId}
            onGoalSelect={handleGoalSelect}
            onAddGoal={() => {
              // 목표 추가 화면으로 이동
              console.log("목표 추가");
            }}
          />
        </View>

        {/* 현재 단계 정보 */}
        {currentPhase && (
          <View style={styles.phaseSection}>
            <Text style={styles.sectionTitle}>현재 단계</Text>
            <CurrentPhaseCard
              currentPhase={currentPhase}
              totalPhases={
                goals.find((g) => g.id === activeGoalId)?.roadmap?.roadmap
                  ?.length || 1
              }
              onPress={() => {
                // 단계 상세 보기
                console.log("단계 상세 보기");
              }}
            />
          </View>
        )}

        {/* 오늘의 활동 */}
        {todayActivities.length > 0 && (
          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>오늘의 활동</Text>
            {todayActivities.map((activity, index) => (
              <ScheduleItemCard
                key={`${activity.week}-${activity.day}-${activity.phase_link}-${index}`}
                scheduleItem={activity}
                isCompleted={completedActivities.includes(
                  `${activity.week}-${activity.day}-${activity.phase_link}-${index}`
                )}
                onPress={() => {
                  // 활동 상세 보기
                  console.log("활동 상세 보기", activity);
                }}
                onComplete={() =>
                  handleActivityComplete(
                    `${activity.week}-${activity.day}-${activity.phase_link}-${index}`
                  )
                }
              />
            ))}
          </View>
        )}

        {/* 활동이 없는 경우 */}
        {todayActivities.length === 0 && activeGoalId && (
          <View style={styles.emptyActivitiesSection}>
            <Text style={styles.emptyActivitiesTitle}>
              오늘은 휴식일이에요! 😊
            </Text>
            <Text style={styles.emptyActivitiesMessage}>
              내일 새로운 활동으로 만나요!
            </Text>
          </View>
        )}

        {/* 통계 정보 */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.totalSteps}</Text>
            <Text style={styles.statLabel}>총 스텝</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.completedSteps}</Text>
            <Text style={styles.statLabel}>완료한 스텝</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Math.round(
                (userData.completedSteps / userData.totalSteps) * 100
              )}
              %
            </Text>
            <Text style={styles.statLabel}>달성률</Text>
          </View>
        </View>

        {/* 게임 정보 */}
        <View style={styles.gameInfoSection}>
          <Text style={styles.gameInfoTitle}>🎮 게임 정보</Text>
          <View style={styles.gameStats}>
            <View style={styles.gameStatItem}>
              <Text style={styles.gameStatNumber}>
                Level {userGameData.level}
              </Text>
              <Text style={styles.gameStatLabel}>현재 레벨</Text>
            </View>
            <View style={styles.gameStatItem}>
              <Text style={styles.gameStatNumber}>
                {userGameData.experience} EXP
              </Text>
              <Text style={styles.gameStatLabel}>경험치</Text>
            </View>
            <View style={styles.gameStatItem}>
              <Text style={styles.gameStatNumber}>
                {userGameData.currentStreak}일
              </Text>
              <Text style={styles.gameStatLabel}>연속 성공</Text>
            </View>
          </View>
        </View>

        {/* 배지 섹션 */}
        <View style={styles.badgesSection}>
          <Text style={styles.badgesTitle}>🏆 배지</Text>
          <View style={styles.badgesGrid}>
            {mockBadges.slice(0, 6).map((badge) => (
              <BadgeCard key={badge.id} badge={badge} size="small" />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 레벨업 애니메이션 */}
      <LevelUpAnimation
        isVisible={showLevelUp}
        newLevel={newLevel}
        onComplete={handleLevelUpComplete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: 4,
  },
  date: {
    ...typography.body,
    color: colors.secondaryText,
  },
  streakContainer: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  streakTitle: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 8,
  },
  streakCount: {
    ...typography.h1,
    color: colors.deepMint,
    fontWeight: "700",
    marginBottom: 8,
  },
  encouragementMessage: {
    ...typography.body,
    color: colors.primaryText,
    textAlign: "center",
    lineHeight: 20,
  },
  characterSection: {
    alignItems: "center",
    marginVertical: 10,
  },
  goalSection: {
    marginBottom: 24,
  },
  phaseSection: {
    marginBottom: 24,
  },
  activitiesSection: {
    marginBottom: 24,
  },
  emptyActivitiesSection: {
    marginBottom: 24,
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyActivitiesTitle: {
    ...typography.h3,
    color: colors.primaryText,
    marginBottom: 8,
  },
  emptyActivitiesMessage: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.primaryText,
    marginLeft: 20,
    marginBottom: 10,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    ...typography.h2,
    color: colors.deepMint,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  gameInfoSection: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gameInfoTitle: {
    ...typography.h2,
    color: colors.primaryText,
    marginBottom: 16,
    textAlign: "center",
  },
  gameStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  gameStatItem: {
    alignItems: "center",
  },
  gameStatNumber: {
    ...typography.h2,
    color: colors.deepMint,
    fontWeight: "700",
    marginBottom: 4,
  },
  gameStatLabel: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  badgesSection: {
    backgroundColor: colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  badgesTitle: {
    ...typography.h2,
    color: colors.primaryText,
    marginBottom: 16,
    textAlign: "center",
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
  },
});
