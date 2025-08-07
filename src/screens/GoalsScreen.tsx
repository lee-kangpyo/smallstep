import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoalCard } from "../components/GoalCard";
import { GoalModal } from "../components/GoalModal";
import { Button } from "../components/Button";
import { Goal } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import { useGoalStore } from "../stores";

interface GoalsScreenProps {
  navigation: any;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const {
    goals,
    activeGoalId,
    addGoal,
    updateGoal,
    deleteGoal,
    setActiveGoal,
  } = useGoalStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const handleGoalPress = (goal: Goal) => {
    setActiveGoal(goal.id);
    // 홈 화면으로 이동하면서 선택된 목표 전달
    navigation.navigate("Home", { selectedGoalId: goal.id });
  };

  const handleGoalEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setModalVisible(true);
  };

  const handleGoalDelete = (goal: Goal) => {
    Alert.alert("목표 삭제", `${goal.title} 목표를 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          deleteGoal(goal.id);
        },
      },
    ]);
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setModalVisible(true);
  };

  const handleBackToHome = () => {
    navigation.navigate("Home");
  };

  const activeGoal = goals.find((g) => g.id === activeGoalId);

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (editingGoal) {
      // 기존 목표 수정
      updateGoal(editingGoal.id, goalData);
    } else {
      // 새 목표 추가
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: goalData.title!,
        description: goalData.description || "",
        priority: goalData.priority || 3,
        status: goalData.status || "active",
        roadmap: {
          roadmap: [],
          schedule: [],
        },
        progress: {
          currentPhase: 1,
          completedPhases: [],
          completedScheduleItems: [],
          totalProgress: 0,
          consecutiveDays: 0,
        },
        createdAt: new Date(),
      };
      addGoal(newGoal);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingGoal(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToHome}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.title}>목표 관리</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddGoal}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={24} color={colors.deepMint} />
        </TouchableOpacity>
      </View>

      {/* 활성 목표 표시 */}
      {activeGoal && (
        <View style={styles.activeGoalSection}>
          <Text style={styles.sectionTitle}>현재 활성 목표</Text>
          <GoalCard
            goal={activeGoal}
            isActive={true}
            onPress={() => handleGoalPress(activeGoal)}
            onEdit={() => handleGoalEdit(activeGoal)}
            onDelete={() => handleGoalDelete(activeGoal)}
          />
        </View>
      )}

      {/* 목표 목록 */}
      <View style={styles.goalsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeGoal ? "다른 목표들" : "목표 목록"}
          </Text>
          <Text style={styles.goalCount}>{goals.length}개의 목표</Text>
        </View>

        <ScrollView
          style={styles.goalsList}
          showsVerticalScrollIndicator={false}
        >
          {goals
            .filter((goal) => goal.id !== activeGoalId)
            .map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => handleGoalPress(goal)}
                onEdit={() => handleGoalEdit(goal)}
                onDelete={() => handleGoalDelete(goal)}
              />
            ))}
        </ScrollView>
      </View>

      {/* 빈 상태 */}
      {goals.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name="flag-outline"
            size={64}
            color={colors.secondaryText}
          />
          <Text style={styles.emptyTitle}>목표가 없습니다</Text>
          <Text style={styles.emptyDescription}>
            첫 번째 목표를 추가해보세요!
          </Text>
          <Button
            title="목표 추가하기"
            onPress={handleAddGoal}
            variant="primary"
            style={styles.addGoalButton}
          />
        </View>
      )}

      {/* 목표 편집 모달 */}
      <GoalModal
        visible={modalVisible}
        goal={editingGoal}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlue,
  },
  backButton: {
    padding: 4,
  },
  title: {
    ...typography.h2,
    color: colors.primaryText,
    fontWeight: "600",
  },
  addButton: {
    padding: 4,
  },
  activeGoalSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  goalsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
  },
  goalCount: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  goalsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 32,
  },
  addGoalButton: {
    minWidth: 200,
  },
});
