import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Phase } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface CurrentPhaseCardProps {
  currentPhase: Phase;
  totalPhases: number;
  onPress?: () => void;
}

export const CurrentPhaseCard: React.FC<CurrentPhaseCardProps> = ({
  currentPhase,
  totalPhases,
  onPress,
}) => {
  const progressPercentage = (currentPhase.phase / totalPhases) * 100;

  return (
    <Card variant="elevated" padding="medium" style={styles.container}>
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.phaseInfo}>
            <Text style={styles.phaseTitle}>현재 단계</Text>
            <Text style={styles.phaseNumber}>
              {currentPhase.phase} / {totalPhases}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
        </View>

        {/* 단계 제목 */}
        <Text style={styles.phaseName}>{currentPhase.phase_title}</Text>

        {/* 단계 설명 */}
        <Text style={styles.phaseDescription} numberOfLines={2}>
          {currentPhase.phase_description}
        </Text>

        {/* 주요 마일스톤 */}
        {currentPhase.key_milestones.length > 0 && (
          <View style={styles.milestonesSection}>
            <Text style={styles.milestonesTitle}>주요 마일스톤</Text>
            <View style={styles.milestonesList}>
              {currentPhase.key_milestones
                .slice(0, 3)
                .map((milestone, index) => (
                  <View key={index} style={styles.milestoneItem}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={14}
                      color={colors.secondaryText}
                    />
                    <Text style={styles.milestoneText} numberOfLines={1}>
                      {milestone}
                    </Text>
                  </View>
                ))}
              {currentPhase.key_milestones.length > 3 && (
                <Text style={styles.moreMilestones}>
                  +{currentPhase.key_milestones.length - 3}개 더
                </Text>
              )}
            </View>
          </View>
        )}

        {/* 상세 보기 버튼 */}
        <View style={styles.detailButton}>
          <Text style={styles.detailButtonText}>상세 보기</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.deepMint} />
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
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
  phaseInfo: {
    flex: 1,
  },
  phaseTitle: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 2,
  },
  phaseNumber: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
  },
  progressContainer: {
    alignItems: "flex-end",
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: colors.lightBlue,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.deepMint,
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  phaseName: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 8,
  },
  phaseDescription: {
    ...typography.body,
    color: colors.secondaryText,
    lineHeight: 18,
    marginBottom: 16,
  },
  milestonesSection: {
    marginBottom: 16,
  },
  milestonesTitle: {
    ...typography.h5,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 8,
  },
  milestonesList: {
    gap: 6,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneText: {
    ...typography.caption,
    color: colors.primaryText,
    marginLeft: 6,
    flex: 1,
  },
  moreMilestones: {
    ...typography.caption,
    color: colors.deepMint,
    fontStyle: "italic",
    marginLeft: 20,
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightBlue,
  },
  detailButtonText: {
    ...typography.body,
    color: colors.deepMint,
    fontWeight: "500",
    marginRight: 4,
  },
});
