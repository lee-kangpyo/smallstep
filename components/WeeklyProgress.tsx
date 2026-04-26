import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface WeeklyProgressProps {
  completedCount: number;
  totalCount: number;
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({
  completedCount,
  totalCount,
}) => {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>이번 주 진행 상황</Text>
        <Text style={styles.percentage}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress}%` },
          ]}
        />
      </View>
      <Text style={styles.count}>
        {completedCount}/{totalCount} 완료
      </Text>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  percentage: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3B82F6",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  count: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "right",
  },
});
