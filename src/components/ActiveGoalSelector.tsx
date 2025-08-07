import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Goal } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface ActiveGoalSelectorProps {
  goals: Goal[];
  activeGoalId: string | null;
  onGoalSelect: (goalId: string) => void;
  onAddGoal?: () => void;
}

export const ActiveGoalSelector: React.FC<ActiveGoalSelectorProps> = ({
  goals,
  activeGoalId,
  onGoalSelect,
  onAddGoal,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const activeGoal = goals.find((g) => g.id === activeGoalId);

  const handleGoalPress = (goal: Goal) => {
    if (goal.id === activeGoalId) {
      return; // 이미 활성 목표인 경우
    }

    Alert.alert(
      "활성 목표 변경",
      `"${goal.title}"을(를) 활성 목표로 설정하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "변경",
          onPress: () => {
            onGoalSelect(goal.id);
            setModalVisible(false);
          },
        },
      ]
    );
  };

  const handleAddGoal = () => {
    setModalVisible(false);
    onAddGoal?.();
  };

  return (
    <>
      {/* 활성 목표 표시 */}
      <Card variant="elevated" padding="medium" style={styles.container}>
        <TouchableOpacity
          style={styles.activeGoalContent}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.activeGoalHeader}>
            <View style={styles.activeGoalInfo}>
              <Text style={styles.activeGoalLabel}>활성 목표</Text>
              <Text style={styles.activeGoalTitle}>
                {activeGoal?.title || "목표를 선택해주세요"}
              </Text>
            </View>
            <Ionicons
              name="chevron-down"
              size={20}
              color={colors.secondaryText}
            />
          </View>

          {activeGoal && (
            <View style={styles.activeGoalDetails}>
              <Text style={styles.activeGoalDescription} numberOfLines={2}>
                {activeGoal.description || "설명이 없습니다"}
              </Text>
              <View style={styles.activeGoalStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {activeGoal.progress.totalProgress}%
                  </Text>
                  <Text style={styles.statLabel}>진행률</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {activeGoal.progress.consecutiveDays}
                  </Text>
                  <Text style={styles.statLabel}>연속일</Text>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </Card>

      {/* 목표 선택 모달 */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* 모달 헤더 */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={colors.primaryText} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>목표 선택</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
              <Ionicons name="add" size={24} color={colors.deepMint} />
            </TouchableOpacity>
          </View>

          {/* 목표 목록 */}
          <ScrollView
            style={styles.goalsList}
            showsVerticalScrollIndicator={false}
          >
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalItem,
                  goal.id === activeGoalId && styles.activeGoalItem,
                ]}
                onPress={() => handleGoalPress(goal)}
                activeOpacity={0.7}
              >
                <View style={styles.goalItemContent}>
                  <View style={styles.goalItemHeader}>
                    <Text style={styles.goalItemTitle}>{goal.title}</Text>
                    {goal.id === activeGoalId && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>활성</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.goalItemDescription} numberOfLines={2}>
                    {goal.description || "설명이 없습니다"}
                  </Text>
                  <View style={styles.goalItemStats}>
                    <Text style={styles.goalItemProgress}>
                      진행률 {goal.progress.totalProgress}%
                    </Text>
                    <Text style={styles.goalItemStatus}>
                      {goal.status === "active"
                        ? "진행 중"
                        : goal.status === "paused"
                        ? "일시정지"
                        : "완료"}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 빈 상태 */}
          {goals.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons
                name="flag-outline"
                size={48}
                color={colors.secondaryText}
              />
              <Text style={styles.emptyTitle}>목표가 없습니다</Text>
              <Text style={styles.emptyDescription}>
                첫 번째 목표를 추가해보세요!
              </Text>
              <TouchableOpacity
                style={styles.addGoalButton}
                onPress={handleAddGoal}
              >
                <Text style={styles.addGoalButtonText}>목표 추가하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  activeGoalContent: {
    flex: 1,
  },
  activeGoalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activeGoalInfo: {
    flex: 1,
  },
  activeGoalLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  activeGoalTitle: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
  },
  activeGoalDetails: {
    marginTop: 8,
  },
  activeGoalDescription: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: 12,
    lineHeight: 18,
  },
  activeGoalStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    ...typography.h4,
    color: colors.deepMint,
    fontWeight: "600",
  },
  statLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.lightBlue,
    marginHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlue,
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.primaryText,
    fontWeight: "600",
  },
  addButton: {
    padding: 4,
  },
  goalsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlue,
  },
  activeGoalItem: {
    backgroundColor: colors.lightMint,
    borderRadius: 8,
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  goalItemContent: {
    flex: 1,
  },
  goalItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  goalItemTitle: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
    flex: 1,
  },
  activeBadge: {
    backgroundColor: colors.deepMint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  goalItemDescription: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: 8,
    lineHeight: 18,
  },
  goalItemStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalItemProgress: {
    ...typography.caption,
    color: colors.deepMint,
    fontWeight: "500",
  },
  goalItemStatus: {
    ...typography.caption,
    color: colors.secondaryText,
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
    backgroundColor: colors.deepMint,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addGoalButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
  },
});
