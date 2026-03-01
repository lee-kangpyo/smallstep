import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WeekProgressStats } from "../models/useWeekProgressViewModel";
import { colors } from "../../../constants/colors";
import { typography } from "../../../constants/typography";

interface WeekProgressSummaryProps {
  stats: WeekProgressStats;
  onViewAllPress?: () => void;
}

export const WeekProgressSummary: React.FC<WeekProgressSummaryProps> = ({
  stats,
  onViewAllPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>이번 주 요약</Text>

      {/* 진행률 바 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${stats.progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{stats.progress}%</Text>
      </View>

      {/* 통계 정보 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>완료</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.missedNumber]}>
            {stats.missed}
          </Text>
          <Text style={styles.statLabel}>미완료</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.remaining}</Text>
          <Text style={styles.statLabel}>남은 활동</Text>
        </View>
      </View>

      {/* 전체 보기 버튼 */}
      {onViewAllPress && (
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={onViewAllPress}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>전체 목표 보기 →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 20,
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
  title: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightBlue,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.deepMint,
    borderRadius: 4,
  },
  progressText: {
    ...typography.h4,
    color: colors.deepMint,
    fontWeight: "600",
    textAlign: "right",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    ...typography.h3,
    color: colors.deepMint,
    fontWeight: "700",
    marginBottom: 4,
  },
  missedNumber: {
    color: colors.error,
  },
  statLabel: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  viewAllButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
    alignItems: "center",
  },
  viewAllText: {
    ...typography.body,
    color: colors.deepMint,
    fontWeight: "600",
  },
});
