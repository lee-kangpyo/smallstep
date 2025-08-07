import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Goal, calculateGoalProgress, getCurrentPhase } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface GoalCardProps {
  goal: Goal;
  isActive?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  style?: ViewStyle;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isActive = false,
  onPress,
  onEdit,
  onDelete,
  style,
}) => {
  const progress = calculateGoalProgress(goal);
  const currentPhase = getCurrentPhase(goal);

  const getStatusColor = (status: Goal["status"]) => {
    switch (status) {
      case "active":
        return colors.deepMint;
      case "paused":
        return colors.coralPink;
      case "completed":
        return colors.success;
      default:
        return colors.secondaryText;
    }
  };

  const getStatusText = (status: Goal["status"]) => {
    switch (status) {
      case "active":
        return "진행 중";
      case "paused":
        return "일시정지";
      case "completed":
        return "완료";
      default:
        return "알 수 없음";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isActive && styles.activeContainer, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Card variant="elevated" padding="medium" style={styles.card}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {goal.title}
            </Text>
            {isActive && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>활성</Text>
              </View>
            )}
          </View>

          {/* 액션 버튼들 */}
          <View style={styles.actionButtons}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onEdit}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="pencil"
                  size={16}
                  color={colors.secondaryText}
                />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onDelete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash" size={16} color={colors.coralPink} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 설명 */}
        <Text style={styles.description} numberOfLines={2}>
          {goal.description}
        </Text>

        {/* 진행 상황 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>진행률</Text>
            <Text style={styles.progressPercentage}>{progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* 현재 단계 */}
        {currentPhase && (
          <View style={styles.phaseContainer}>
            <Text style={styles.phaseLabel}>현재 단계</Text>
            <Text style={styles.phaseTitle} numberOfLines={1}>
              {currentPhase.phase_title}
            </Text>
          </View>
        )}

        {/* 상태 및 정보 */}
        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(goal.status) },
              ]}
            />
            <Text style={styles.statusText}>{getStatusText(goal.status)}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {goal.progress.consecutiveDays}일 연속
            </Text>
            <Text style={styles.infoText}>우선순위 {goal.priority}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  activeContainer: {
    borderWidth: 2,
    borderColor: colors.deepMint,
    borderRadius: 18,
  },
  card: {
    margin: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
    flex: 1,
  },
  activeBadge: {
    backgroundColor: colors.deepMint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  activeBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  description: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: 16,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressText: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  progressPercentage: {
    ...typography.caption,
    color: colors.deepMint,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.lightBlue,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.deepMint,
    borderRadius: 3,
  },
  phaseContainer: {
    marginBottom: 16,
  },
  phaseLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  phaseTitle: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    ...typography.caption,
    color: colors.secondaryText,
    marginLeft: 12,
  },
});
