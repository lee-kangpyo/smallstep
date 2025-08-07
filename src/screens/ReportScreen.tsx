import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { StampCalendar } from "../components/StampCalendar";
import { ProgressGraph } from "../components/ProgressGraph";
import { AIFeedbackCard } from "../components/AIFeedbackCard";
import { RoadmapProgressCard } from "../components/RoadmapProgressCard";
import { GoalFilter } from "../components/GoalFilter";
import {
  generateMonthCalendar,
  generateWeekData,
  calculateSuccessRate,
  WeekData,
  MonthData,
} from "../utils/dateUtils";
import { useGoalStore, useUserStore } from "../stores";
import { Goal, Phase } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

export const ReportScreen: React.FC = () => {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [calendarData, setCalendarData] = useState<WeekData | MonthData>(
    generateWeekData()
  );
  const [successRate, setSuccessRate] = useState(0);

  // 전역 상태 사용
  const { goals, selectedGoalId, setSelectedGoal, getSelectedGoal } =
    useGoalStore();
  const { userData, userGameData } = useUserStore();

  // 선택된 목표 찾기
  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  useEffect(() => {
    updateCalendarData();
  }, [viewMode]);

  useEffect(() => {
    if (selectedGoalId) {
      const goal = goals.find((g) => g.id === selectedGoalId);
      setSelectedGoal(goal?.id || null);
    }
  }, [selectedGoalId, goals]);

  const updateCalendarData = () => {
    const data =
      viewMode === "week" ? generateWeekData() : generateMonthCalendar();
    setCalendarData(data);

    // 성공률 계산
    const totalDays = viewMode === "week" ? data.totalDays : data.totalDays;
    const successCount =
      viewMode === "week" && "successCount" in data
        ? data.successCount
        : "totalSuccess" in data
        ? data.totalSuccess
        : 0;
    const rate = calculateSuccessRate(successCount, totalDays);
    setSuccessRate(rate);
  };

  const handleDayPress = (day: any) => {
    // 날짜 클릭 시 상세 정보 표시 (나중에 구현)
    console.log("Selected day:", day);
  };

  const handleViewModeToggle = () => {
    setViewMode(viewMode === "week" ? "month" : "week");
  };

  const handleGoalSelect = (goalId: string | null) => {
    setSelectedGoal(goalId);
  };

  const handlePhasePress = (phase: Phase) => {
    console.log("Phase pressed:", phase);
  };

  // 주간/월간 성취 데이터 생성
  const generateProgressData = () => {
    if (viewMode === "week") {
      return [
        { label: "월", value: 5, maxValue: 7 },
        { label: "화", value: 4, maxValue: 7 },
        { label: "수", value: 6, maxValue: 7 },
        { label: "목", value: 3, maxValue: 7 },
        { label: "금", value: 7, maxValue: 7 },
        { label: "토", value: 2, maxValue: 7 },
        { label: "일", value: 4, maxValue: 7 },
      ];
    } else {
      return [
        { label: "1주차", value: 18, maxValue: 28 },
        { label: "2주차", value: 22, maxValue: 28 },
        { label: "3주차", value: 19, maxValue: 28 },
        { label: "4주차", value: 25, maxValue: 28 },
      ];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>긍정 리포트</Text>
          <Text style={styles.subtitle}>
            당신의 노력을 비판단적으로 응원해요
          </Text>
        </View>

        {/* 뷰 모드 토글 */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "week" && styles.activeToggleButton,
            ]}
            onPress={() => setViewMode("week")}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === "week" && styles.activeToggleText,
              ]}
            >
              주간
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === "month" && styles.activeToggleButton,
            ]}
            onPress={() => setViewMode("month")}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === "month" && styles.activeToggleText,
              ]}
            >
              월간
            </Text>
          </TouchableOpacity>
        </View>

        {/* 목표별 필터 */}
        <GoalFilter
          goals={goals}
          selectedGoalId={selectedGoalId}
          onGoalSelect={handleGoalSelect}
        />

        {/* AI 격려 메시지 카드 */}
        <AIFeedbackCard
          successRate={successRate}
          consecutiveDays={7}
          totalSteps={25}
          completedSteps={18}
        />

        {/* 로드맵 진행 상황 */}
        {selectedGoal && (
          <RoadmapProgressCard
            phases={selectedGoal.roadmap.roadmap}
            currentPhase={selectedGoal.progress.currentPhase}
            completedPhases={selectedGoal.progress.completedPhases}
            onPhasePress={handlePhasePress}
          />
        )}

        {/* 스탬프 캘린더 */}
        <StampCalendar
          data={calendarData}
          onDayPress={handleDayPress}
          viewMode={viewMode}
        />

        {/* 성취 그래프 */}
        <ProgressGraph
          data={generateProgressData()}
          title={`${viewMode === "week" ? "주간" : "월간"} 성취도`}
          subtitle="휴식도 성장의 일부예요"
          type="daily"
        />

        {/* 단계별 성취도 그래프 */}
        {selectedGoal && (
          <ProgressGraph
            data={selectedGoal.roadmap.roadmap.map((phase) => ({
              label: `단계 ${phase.phase}`,
              value: selectedGoal.progress.completedPhases.includes(phase.phase)
                ? 1
                : 0,
              maxValue: 1,
            }))}
            title="단계별 성취도"
            subtitle="각 단계의 완료 상황을 확인해보세요"
            type="phase"
          />
        )}

        {/* 추가 통계 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {selectedGoal
                ? selectedGoal.progress.completedScheduleItems.length
                : 18}
            </Text>
            <Text style={styles.statLabel}>완료한 활동</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {selectedGoal ? selectedGoal.progress.consecutiveDays : 7}
            </Text>
            <Text style={styles.statLabel}>연속 성공일</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {selectedGoal && selectedGoal.roadmap.roadmap.length > 0
                ? Math.round(
                    (selectedGoal.progress.completedPhases.length /
                      selectedGoal.roadmap.roadmap.length) *
                      100
                  )
                : 72}
              %
            </Text>
            <Text style={styles.statLabel}>단계 완료율</Text>
          </View>
        </View>
      </ScrollView>
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
  title: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.secondaryText,
  },
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeToggleButton: {
    backgroundColor: colors.deepMint,
  },
  toggleText: {
    ...typography.body,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  activeToggleText: {
    color: colors.white,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    textAlign: "center",
  },
});
