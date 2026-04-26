import React, { useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStatsViewModel } from "./models/viewModel";
import { styles } from "./styles";

export const StatsScreen: React.FC = () => {
  const {
    stats,
    streakInfo,
    weeklyStats,
    goals,
    goalPhases,
    isLoading,
    fetchStats,
    fetchStreakInfo,
    fetchWeeklyStats,
    fetchGoals,
  } = useStatsViewModel();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStats(), fetchStreakInfo(), fetchWeeklyStats(), fetchGoals()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
    fetchStreakInfo();
    fetchWeeklyStats();
    fetchGoals();
  }, []);

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>통계 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const weekDays = ["월", "화", "수", "목", "금", "토", "일"];
  const completionData = weeklyStats?.daily_completion || [0, 0, 0, 0, 0, 0, 0];
  const maxCompletion = Math.max(...completionData, 1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>통계</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 전체 통계 카드 */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total_goals}</Text>
            <Text style={styles.statLabel}>전체 목표</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.active_goals}</Text>
            <Text style={styles.statLabel}>진행 중</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.completed_goals}</Text>
            <Text style={styles.statLabel}>완료</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.level}</Text>
            <Text style={styles.statLabel}>레벨</Text>
          </View>
        </View>

        {/* 주간 완료율 그래프 (최근 4주) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 4주 완료율</Text>
          <View style={styles.chartCard}>
            {weeklyStats.length > 0 ? (
              <View style={styles.barChartContainer}>
                {weeklyStats.map((week, index) => {
                  const rate = week.completion_rate;
                  // 인덱스 0이 가장 최근이므로 역순으로 표시하거나 적절히 정렬
                  return (
                    <View key={index} style={styles.barColumn}>
                      <View style={styles.barWrapper}>
                        <View
                          style={[
                            styles.bar,
                            { height: `${Math.max(rate, 5)}%` },
                            index === 0 && styles.todayBar,
                            rate === 100 && styles.completedBar,
                          ]}
                        />
                      </View>
                      <Text style={[styles.barLabel, index === 0 && styles.todayLabel]}>
                        {index === 0 ? "이번 주" : `${index}주 전`}
                      </Text>
                      <Text style={styles.barValue}>{rate}%</Text>
                    </View>
                  );
                }).reverse()}
              </View>
            ) : (
              <Text style={styles.emptyText}>주간 통계 데이터가 없습니다.</Text>
            )}
          </View>
        </View>

        {/* 태스크 현황 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>태스크 현황</Text>
          <View style={styles.taskStatsCard}>
            <View style={styles.taskStatRow}>
              <Text style={styles.taskStatLabel}>전체 태스크</Text>
              <Text style={styles.taskStatValue}>{stats.total_tasks}</Text>
            </View>
            <View style={styles.taskStatRow}>
              <Text style={styles.taskStatLabel}>완료</Text>
              <Text style={[styles.taskStatValue, styles.completedText]}>
                {stats.completed_tasks}
              </Text>
            </View>
            <View style={styles.taskStatRow}>
              <Text style={styles.taskStatLabel}>걱정</Text>
              <Text style={[styles.taskStatValue, styles.skippedText]}>
                {stats.skipped_tasks}
              </Text>
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${stats.weekly_completion_rate}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                주간 완료율 {stats.weekly_completion_rate}%
              </Text>
            </View>
          </View>
        </View>

        {/* Phase별 진행 현황 */}
        {goals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>목표별 Phase 진행</Text>
            {goals.map((goal) => {
              const phases = goalPhases[goal.id] || [];
              const completedPhases = phases.filter((p) => p.status === "COMPLETED").length;
              const totalPhases = phases.length;
              const phaseProgress = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0;

              return (
                <View key={goal.id} style={styles.goalPhaseCard}>
                  <Text style={styles.goalPhaseTitle} numberOfLines={1}>
                    {goal.title}
                  </Text>
                  <View style={styles.goalPhaseProgressRow}>
                    <View style={styles.goalPhaseProgressBarContainer}>
                      <View
                        style={[
                          styles.goalPhaseProgressBar,
                          { width: `${phaseProgress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.goalPhaseProgressText}>
                      {completedPhases}/{totalPhases}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* 스트릭 히스토리 */}
        {streakInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>스트릭 히스토리</Text>
            <View style={styles.streakHistoryCard}>
              <View style={styles.streakRow}>
                <View style={styles.streakItem}>
                  <Text style={styles.streakValue}>
                    {streakInfo.current_streak}일
                  </Text>
                  <Text style={styles.streakLabel}>현재 연속</Text>
                </View>
                <View style={styles.streakDivider} />
                <View style={styles.streakItem}>
                  <Text style={styles.streakValue}>
                    {streakInfo.longest_streak}일
                  </Text>
                  <Text style={styles.streakLabel}>최장 연속</Text>
                </View>
              </View>
              <View style={styles.calendarContainer}>
                <Text style={styles.calendarTitle}>최근 30일</Text>
                <View style={styles.calendarGrid}>
                  {streakInfo.streak_history.map((day, index) => (
                    <View
                      key={index}
                      style={[
                        styles.calendarDay,
                        day.completed && styles.calendarDayCompleted,
                      ]}
                    >
                      <View
                        style={[
                          styles.streakDot,
                          day.completed ? styles.streakDotCompleted : styles.streakDotEmpty,
                        ]}
                      />
                    </View>
                  ))}
                </View>
                <View style={styles.calendarLegend}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.legendDotActive]} />
                    <Text style={styles.legendText}>완료</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, styles.legendDotInactive]} />
                    <Text style={styles.legendText}>미완료</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* 경험치 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>경험치</Text>
          <View style={styles.xpCard}>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>현재 XP</Text>
              <Text style={styles.xpValue}>{stats.experience_points}</Text>
            </View>
            <View style={styles.xpRow}>
              <Text style={styles.xpLabel}>다음 레벨까지</Text>
              <Text style={styles.xpValue}>
                {stats.next_level_xp - stats.experience_points} XP
              </Text>
            </View>
            <View style={styles.xpBarContainer}>
              <View
                style={[
                  styles.xpBar,
                  {
                    width: `${
                      (stats.experience_points / stats.next_level_xp) * 100
                    }%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
