import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { PhaseTimeline } from "../../components/PhaseTimeline";
import { TaskCard } from "../../components/TaskCard";
import { ActivityLogList } from "../../components/ActivityLogList";
import { useGoalDetailViewModel } from "./models/viewModel";
import { styles } from "./styles";

export const GoalDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { goalId } = route.params as { goalId: number };

  const {
    goal,
    phases,
    weeklyPlan,
    activityLogs,
    isLoading,
    fetchGoalDetail,
    fetchPhases,
    fetchCurrentWeeklyPlan,
    fetchActivityLogs,
    handleCompleteTask,
    handleBack,
  } = useGoalDetailViewModel(goalId);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchGoalDetail(goalId),
      fetchPhases(goalId),
      fetchCurrentWeeklyPlan(goalId),
      fetchActivityLogs(goalId),
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchGoalDetail(goalId);
    fetchPhases(goalId);
    fetchCurrentWeeklyPlan(goalId);
    fetchActivityLogs(goalId);
  }, [goalId]);

  const currentPhase = phases.find((p) => p.status === "ACTIVE") || phases[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {goal?.title || "목표 상세"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 목표 기본 정보 */}
        {goal && (
          <View style={styles.goalInfoSection}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            {goal.description && (
              <Text style={styles.goalDescription}>{goal.description}</Text>
            )}
            <View style={styles.goalMeta}>
              <View style={styles.progressContainer}>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${goal.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>{goal.progress}%</Text>
              </View>
              {goal.target_date && (
                <Text style={styles.targetDate}>
                  마감일: {new Date(goal.target_date).toLocaleDateString("ko-KR")}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Phase 타임라인 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phase 진행 상황</Text>
          {phases.length > 0 ? (
            <PhaseTimeline
              phases={phases}
              currentPhaseId={currentPhase?.id}
            />
          ) : (
            <Text style={styles.emptyText}>Phase 정보를 불러오는 중...</Text>
          )}
        </View>

        {/* 이번 주 할 일 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이번 주 할 일</Text>
          {weeklyPlan?.tasks && weeklyPlan.tasks.length > 0 ? (
            weeklyPlan.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>이번 주 할 일이 없습니다.</Text>
          )}
        </View>

        {/* 활동 이력 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 활동</Text>
          <ActivityLogList logs={activityLogs} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
