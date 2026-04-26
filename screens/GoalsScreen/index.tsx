import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useGoalsViewModel } from "./models/viewModel";
import { styles } from "./styles";

export const GoalsScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    goals,
    isLoading,
    fetchGoals,
    handleGoalPress,
    handleCreateGoal,
  } = useGoalsViewModel();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchGoals();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "#3B82F6";
      case "COMPLETED":
        return "#10B981";
      case "PAUSED":
        return "#F59E0B";
      case "ARCHIVED":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "진행 중";
      case "COMPLETED":
        return "완료";
      case "PAUSED":
        return "일시 중지";
      case "ARCHIVED":
        return "보관됨";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 목표</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateGoal}
        >
          <Text style={styles.addButtonText}>+ 새 목표</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🎯</Text>
            <Text style={styles.emptyStateTitle}>아직 등록된 목표가 없어요</Text>
            <Text style={styles.emptyStateSubtitle}>
              새로운 목표를 추가하고 시작필보세요!
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleCreateGoal}
            >
              <Text style={styles.emptyStateButtonText}>목표 추가하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalCard}
              onPress={() => handleGoalPress(goal.id)}
            >
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(goal.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{getStatusLabel(goal.status)}</Text>
                </View>
              </View>

              {goal.description && (
                <Text style={styles.goalDescription}>{goal.description}</Text>
              )}

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
                <Text style={styles.dDay}>
                  마감일: {new Date(goal.target_date).toLocaleDateString("ko-KR")}
                </Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
