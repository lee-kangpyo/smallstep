import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Phase } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface RoadmapProgressCardProps {
  phases: Phase[];
  currentPhase: number;
  completedPhases: number[];
  onPhasePress?: (phase: Phase) => void;
}

export const RoadmapProgressCard: React.FC<RoadmapProgressCardProps> = ({
  phases,
  currentPhase,
  completedPhases,
  onPhasePress,
}) => {
  const getPhaseStatus = (phaseNumber: number) => {
    if (completedPhases.includes(phaseNumber)) {
      return "completed";
    } else if (phaseNumber === currentPhase) {
      return "current";
    } else {
      return "pending";
    }
  };

  const getPhaseIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "checkmark-circle";
      case "current":
        return "play-circle";
      default:
        return "ellipse-outline";
    }
  };

  const getPhaseColor = (status: string) => {
    switch (status) {
      case "completed":
        return colors.success;
      case "current":
        return colors.deepMint;
      default:
        return colors.secondaryText;
    }
  };

  const renderPhase = (phase: Phase, index: number) => {
    const status = getPhaseStatus(phase.phase);
    const icon = getPhaseIcon(status);
    const color = getPhaseColor(status);

    return (
      <TouchableOpacity
        key={phase.phase}
        style={styles.phaseItem}
        onPress={() => onPhasePress?.(phase)}
        activeOpacity={0.7}
      >
        <View style={styles.phaseHeader}>
          <View style={styles.phaseIconContainer}>
            <Ionicons name={icon as any} size={24} color={color} />
          </View>
          <View style={styles.phaseInfo}>
            <Text style={styles.phaseNumber}>단계 {phase.phase}</Text>
            <Text style={styles.phaseTitle}>{phase.phase_title}</Text>
          </View>
          <View style={styles.phaseStatus}>
            <Text style={[styles.statusText, { color: color }]}>
              {status === "completed"
                ? "완료"
                : status === "current"
                ? "진행중"
                : "대기"}
            </Text>
          </View>
        </View>

        <Text style={styles.phaseDescription} numberOfLines={2}>
          {phase.phase_description}
        </Text>

        {/* 마일스톤 표시 */}
        {phase.key_milestones.length > 0 && (
          <View style={styles.milestonesContainer}>
            <Text style={styles.milestonesTitle}>주요 마일스톤:</Text>
            {phase.key_milestones.slice(0, 2).map((milestone, idx) => (
              <View key={idx} style={styles.milestoneItem}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={14}
                  color={colors.secondaryText}
                />
                <Text style={styles.milestoneText}>{milestone}</Text>
              </View>
            ))}
            {phase.key_milestones.length > 2 && (
              <Text style={styles.moreMilestones}>
                +{phase.key_milestones.length - 2}개 더
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const completedCount = completedPhases.length;
  const totalProgress =
    phases.length > 0 ? (completedCount / phases.length) * 100 : 0;

  return (
    <Card variant="elevated" padding="large" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>로드맵 진행 상황</Text>
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {completedCount}/{phases.length} 단계 완료
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(totalProgress)}%
          </Text>
        </View>
      </View>

      {/* 전체 진행률 바 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${totalProgress}%` }]} />
        </View>
      </View>

      {/* 단계별 목록 */}
      <View style={styles.phasesContainer}>
        {phases.map((phase) => renderPhase(phase, phase.phase - 1))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
  },
  progressInfo: {
    alignItems: "flex-end",
  },
  progressText: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  progressPercentage: {
    ...typography.h4,
    color: colors.deepMint,
    fontWeight: "700",
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightBlue,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.deepMint,
    borderRadius: 4,
  },
  phasesContainer: {
    gap: 16,
  },
  phaseItem: {
    padding: 16,
    backgroundColor: colors.lightMint,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.deepMint,
  },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  phaseIconContainer: {
    marginRight: 12,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseNumber: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  phaseTitle: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "600",
  },
  phaseStatus: {
    alignItems: "flex-end",
  },
  statusText: {
    ...typography.caption,
    fontWeight: "600",
  },
  phaseDescription: {
    ...typography.body,
    color: colors.primaryText,
    lineHeight: 18,
    marginBottom: 12,
  },
  milestonesContainer: {
    gap: 6,
  },
  milestonesTitle: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "600",
    marginBottom: 4,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneText: {
    ...typography.caption,
    color: colors.primaryText,
    marginLeft: 6,
  },
  moreMilestones: {
    ...typography.caption,
    color: colors.deepMint,
    fontStyle: "italic",
  },
});
