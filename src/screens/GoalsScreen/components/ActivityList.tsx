import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScheduleItem } from "../../../types";
import { colors } from "../../../constants/colors";
import { typography } from "../../../constants/typography";

interface ActivityListProps {
  activities: Array<ScheduleItem & { goalId: string; goalTitle: string }>;
  selectedDate: Date;
  dateTitle: string;
  isActivityCompleted: (key: string) => boolean;
  onActivityPress: (
    activity: ScheduleItem & { goalId: string; goalTitle: string }
  ) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  selectedDate,
  dateTitle,
  isActivityCompleted,
  onActivityPress,
}) => {
  if (activities.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{dateTitle}</Text>
        <View style={styles.emptyActivities}>
          <Text style={styles.emptyActivitiesText}>
            예정된 활동이 없습니다
          </Text>
        </View>
      </View>
    );
  }

  // 요일 이름 매핑 (1=월, 7=일)
  const dayNameMap = ["", "월", "화", "수", "목", "금", "토", "일"];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{dateTitle}</Text>
      {activities.map((activity) => {
        const activityKey = `${activity.goalId}-${activity.week}-${activity.day}`;
        const isCompleted = isActivityCompleted(activityKey);

        return (
          <TouchableOpacity
            key={activityKey}
            style={styles.activityItem}
            onPress={() => onActivityPress(activity)}
            activeOpacity={0.7}
          >
            <View style={styles.activityHeader}>
              <Text style={styles.activityGoalTitle}>
                {activity.goalTitle}
              </Text>
              <Text style={styles.activityWeekDay}>
                {activity.week}주차, {dayNameMap[activity.day]}요일
              </Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              {isCompleted && (
                <View style={styles.completedBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.success}
                  />
                  <Text style={styles.completedText}>완료</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
  },
  emptyActivities: {
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyActivitiesText: {
    ...typography.body,
    color: colors.secondaryText,
  },
  activityItem: {
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activityGoalTitle: {
    ...typography.caption,
    color: colors.deepMint,
    fontWeight: "600",
  },
  activityWeekDay: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  activityContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityTitle: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
    flex: 1,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 8,
  },
  completedText: {
    ...typography.caption,
    color: colors.success,
    fontWeight: "600",
  },
});

