import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { ActivityLog } from "../types";

interface ActivityLogListProps {
  logs: ActivityLog[];
  maxItems?: number;
}

export const ActivityLogList: React.FC<ActivityLogListProps> = ({
  logs,
  maxItems = 10,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "COMPLETED":
        return "완료";
      case "SKIPPED":
        return "건너뜀";
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "COMPLETED":
        return "#10B981";
      case "SKIPPED":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  if (logs.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>아직 활동 이력이 없어요</Text>
      </View>
    );
  }

  const displayLogs = logs.slice(0, maxItems);

  return (
    <View style={styles.container}>
      {displayLogs.map((log: any) => (
        <View key={log.id} style={styles.logItem}>
          <View style={styles.logLeft}>
            <View
              style={[
                styles.actionBadge,
                { backgroundColor: getActionColor(log.action) },
              ]}
            >
              <Text style={styles.actionBadgeText}>
                {getActionLabel(log.action)}
              </Text>
            </View>
            <View>
              <Text style={styles.logTaskTitle} numberOfLines={1}>
                {log.task_title || `태스크 #${log.task_id}`}
              </Text>
              <Text style={styles.logTime}>{formatTime(log.created_at)}</Text>
            </View>
          </View>
          <View style={styles.logRight}>
            <Text style={styles.xpText}>+{log.xp_earned} XP</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  logItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  logLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  actionBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  logTaskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  logTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  logRight: {
    alignItems: "flex-end",
  },
  xpText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F59E0B",
  },
});
