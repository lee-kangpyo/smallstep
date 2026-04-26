import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onComplete: (id: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const getStatusColor = () => {
    switch (task.status) {
      case "LOCKED":
        return "#9CA3AF";
      case "AVAILABLE":
        return "#3B82F6";
      case "COMPLETED":
        return "#10B981";
      case "SKIPPED":
        return "#EF4444";
      default:
        return "#9CA3AF";
    }
  };

  const getStatusLabel = () => {
    switch (task.status) {
      case "LOCKED":
        return "잠김";
      case "AVAILABLE":
        return "진행 중";
      case "COMPLETED":
        return "완료";
      case "SKIPPED":
        return "걱정";
      default:
        return "";
    }
  };

  return (
    <View style={[styles.container, { borderLeftColor: getStatusColor() }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.task_title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]} >
          <Text style={styles.statusText}>{getStatusLabel()}</Text>
        </View>
      </View>
      <Text style={styles.description}>{task.task_description}</Text>
      <View style={styles.footer}>
        <Text style={styles.time}>{task.estimated_minutes}분</Text>
        {task.status === "AVAILABLE" && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => onComplete(task.id)}
          >
            <Text style={styles.completeButtonText}>완료</Text>
          </TouchableOpacity>
        )}
        {task.status === "COMPLETED" && (
          <Text style={styles.completedText}>✓ 완료됨</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  completeButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  completedText: {
    color: "#10B981",
    fontWeight: "600",
    fontSize: 14,
  },
});
