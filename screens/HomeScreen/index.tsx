import React, { useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { TaskCard } from "../../components/TaskCard";
import { WeeklyProgress } from "../../components/WeeklyProgress";
import { LevelBadge } from "../../components/LevelBadge";
import { useHomeViewModel } from "./models/viewModel";
import { styles } from "./styles";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    user,
    stats,
    todayTasks,
    streakInfo,
    isLoading,
    fetchUser,
    fetchStats,
    fetchTodayTasks,
    fetchStreakInfo,
    handleCompleteTask,
  } = useHomeViewModel();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchUser(), fetchStats(), fetchTodayTasks(), fetchStreakInfo()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUser();
    fetchStats();
    fetchTodayTasks();
    fetchStreakInfo();
  }, []);

  const completedTasksCount = todayTasks.filter((t) => t.status === "COMPLETED").length;
  const availableTasksCount = todayTasks.filter((t) => t.status === "AVAILABLE").length;
  const totalTasksCount = todayTasks.length;

  const getDynamicEncouragement = () => {
    if (totalTasksCount === 0) {
      return "오늘은 푹 쉬거나 새로운 목표를 세워보는 건 어떨까요? 🌱";
    }
    if (completedTasksCount === totalTasksCount) {
      return `🎉 오늘의 모든 태스크를 완료했어요! ${streakInfo?.current_streak ? `${streakInfo.current_streak}일 연속 달성 훌륭합니다!` : "훌륭합니다!"}`;
    }
    if (completedTasksCount === 0) {
      return "오늘도 힘차게 시작해볼까요? 화이팅! 💪";
    }
    if (completedTasksCount >= totalTasksCount / 2) {
      return "벌써 절반 이상 해냈어요! 조금만 더 힘내세요! 🔥";
    }
    return "좋은 시작입니다! 꾸준히 나아가요 🚀";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 상단 인사말 + LevelBadge + 스트릭 */}
        <View style={styles.headerSection}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {user?.name ? `${user.name}님,` : "안녕하세요,"}
            </Text>
            <Text style={styles.subGreeting}>오늘도 한 걸음 나아가요!</Text>
          </View>

          {stats && (
            <LevelBadge
              level={stats.level}
              experiencePoints={stats.experience_points}
              nextLevelXp={stats.next_level_xp}
            />
          )}

          {streakInfo && (
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>
                🔥 {streakInfo.current_streak}일 연속 달성 중!
              </Text>
            </View>
          )}
        </View>

        {/* 주간 진행 요약 */}
        {stats && (
          <WeeklyProgress
            completedCount={stats.completed_tasks}
            totalCount={stats.total_tasks}
          />
        )}

        {/* 오늘 할 일 */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>
            오늘의 할 일 ({completedTasksCount}/{totalTasksCount})
          </Text>

          {totalTasksCount === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>✨</Text>
              <Text style={styles.emptyStateTitle}>모든 할 일 완료!</Text>
              <Text style={styles.emptyStateSubtitle}>
                오늘도 대단해요. 새 목표를 추가해볼까요?
              </Text>
            </View>
          ) : (
            todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
              />
            ))
          )}
        </View>

        {/* 동적 격려 메시지 */}
        <View style={styles.encouragementSection}>
          <Text style={styles.encouragementText}>
            {getDynamicEncouragement()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
