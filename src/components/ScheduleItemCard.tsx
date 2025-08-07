import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { ScheduleItem } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface ScheduleItemCardProps {
  scheduleItem: ScheduleItem;
  isCompleted?: boolean;
  onPress?: () => void;
  onComplete?: () => void;
}

export const ScheduleItemCard: React.FC<ScheduleItemCardProps> = ({
  scheduleItem,
  isCompleted = false,
  onPress,
  onComplete,
}) => {
  const handleComplete = () => {
    if (!isCompleted && onComplete) {
      onComplete();
    }
  };

  return (
    <Card
      variant="elevated"
      padding="medium"
      style={isCompleted ? styles.completedContainer : styles.container}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {scheduleItem.week}주차 {scheduleItem.day}일
            </Text>
          </View>
          <View style={styles.statusContainer}>
            {isCompleted ? (
              <View style={styles.completedStatus}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={colors.success}
                />
                <Text style={styles.completedText}>완료</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={colors.deepMint}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 활동 타입 */}
        <Text style={styles.activityType}>{scheduleItem.activity_type}</Text>

        {/* 활동 제목 */}
        <Text style={[styles.title, isCompleted && styles.completedTitle]}>
          {scheduleItem.title}
        </Text>

        {/* 활동 설명 */}
        <Text
          style={[
            styles.description,
            isCompleted && styles.completedDescription,
          ]}
          numberOfLines={3}
        >
          {scheduleItem.description}
        </Text>

        {/* 상세 정보 */}
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.secondaryText}
            />
            <Text style={styles.detailText}>예상 소요시간: 미정</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons
              name="trending-up-outline"
              size={14}
              color={colors.secondaryText}
            />
            <Text style={styles.detailText}>난이도: 미정</Text>
          </View>
        </View>

        {/* 완료 버튼 */}
        {!isCompleted && (
          <TouchableOpacity
            style={styles.completeActionButton}
            onPress={handleComplete}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={16} color={colors.white} />
            <Text style={styles.completeActionText}>완료하기</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  completedContainer: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: colors.deepMint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  statusContainer: {
    alignItems: "center",
  },
  completedStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "600",
    marginLeft: 4,
  },
  completeButton: {
    padding: 4,
  },
  activityType: {
    ...typography.caption,
    color: colors.secondaryText,
    fontStyle: "italic",
    marginBottom: 8,
  },
  title: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 8,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: colors.secondaryText,
  },
  description: {
    ...typography.body,
    color: colors.primaryText,
    lineHeight: 18,
    marginBottom: 16,
  },
  completedDescription: {
    color: colors.secondaryText,
  },
  details: {
    marginBottom: 16,
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    ...typography.caption,
    color: colors.secondaryText,
    marginLeft: 6,
  },
  completeActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.deepMint,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  completeActionText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
  },
});
