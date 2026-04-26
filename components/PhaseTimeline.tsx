import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Phase } from "../types";

interface PhaseTimelineProps {
  phases: Phase[];
  currentPhaseId?: number;
}

export const PhaseTimeline: React.FC<PhaseTimelineProps> = ({
  phases,
  currentPhaseId,
}) => {
  return (
    <View style={styles.container}>
      {phases.map((phase, index) => {
        const isCurrent = phase.id === currentPhaseId;
        const isCompleted = phase.status === "COMPLETED";
        const isPending = phase.status === "PENDING";

        return (
          <View key={phase.id} style={styles.phaseRow}>
            <View style={styles.timeline}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.completedDot,
                  isCurrent && styles.currentDot,
                  isPending && styles.pendingDot,
                ]}
              />
              {index < phases.length - 1 && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.completedLine,
                  ]}
                />
              )}
            </View>
            <View
              style={[
                styles.phaseCard,
                isCurrent && styles.currentCard,
              ]}
            >
              <View style={styles.phaseHeader}>
                <Text style={styles.phaseOrder}>Phase {phase.phase_order}</Text>
                {isCurrent && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>현재</Text>
                  </View>
                )}
              </View>
              <Text style={styles.phaseTitle}>{phase.phase_title}</Text>
              <Text style={styles.phaseDescription}>
                {phase.phase_description}
              </Text>
              <Text style={styles.estimatedWeeks}>
                예상 기간: {phase.estimated_weeks}주
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  phaseRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeline: {
    width: 32,
    alignItems: "center",
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  completedDot: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  currentDot: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  pendingDot: {
    backgroundColor: "#F3F4F6",
    borderColor: "#D1D5DB",
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
  completedLine: {
    backgroundColor: "#10B981",
  },
  phaseCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currentCard: {
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  phaseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  phaseOrder: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  currentBadge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  phaseDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  estimatedWeeks: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
