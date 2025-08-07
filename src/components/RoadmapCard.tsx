import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Roadmap, Phase } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface RoadmapCardProps {
  roadmap: Roadmap;
  onPhasePress?: (phase: Phase) => void;
  selectedPhase?: number;
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({
  roadmap,
  onPhasePress,
  selectedPhase,
}) => {
  const totalPhases = roadmap.roadmap.length;
  const totalDuration = roadmap.schedule.length;

  return (
    <Card variant="elevated" padding="large" style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>AI 생성 로드맵</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{totalPhases}</Text>
            <Text style={styles.statLabel}>단계</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{totalDuration}</Text>
            <Text style={styles.statLabel}>활동</Text>
          </View>
        </View>
      </View>

      {/* 로드맵 단계들 */}
      <ScrollView
        style={styles.phasesContainer}
        showsVerticalScrollIndicator={false}
      >
        {roadmap.roadmap.map((phase, index) => (
          <TouchableOpacity
            key={phase.phase}
            style={[
              styles.phaseItem,
              selectedPhase === phase.phase && styles.selectedPhase,
            ]}
            onPress={() => onPhasePress?.(phase)}
            activeOpacity={0.7}
          >
            {/* 단계 번호 */}
            <View style={styles.phaseNumber}>
              <Text style={styles.phaseNumberText}>{phase.phase}</Text>
            </View>

            {/* 단계 내용 */}
            <View style={styles.phaseContent}>
              <Text style={styles.phaseTitle}>{phase.phase_title}</Text>
              <Text style={styles.phaseDescription} numberOfLines={2}>
                {phase.phase_description}
              </Text>

              {/* 주요 마일스톤 */}
              {phase.key_milestones.length > 0 && (
                <View style={styles.milestonesContainer}>
                  <Text style={styles.milestonesLabel}>주요 마일스톤:</Text>
                  {phase.key_milestones.slice(0, 2).map((milestone, idx) => (
                    <View key={idx} style={styles.milestoneItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color={colors.deepMint}
                      />
                      <Text style={styles.milestoneText} numberOfLines={1}>
                        {milestone}
                      </Text>
                    </View>
                  ))}
                  {phase.key_milestones.length > 2 && (
                    <Text style={styles.moreMilestones}>
                      +{phase.key_milestones.length - 2}개 더
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* 화살표 아이콘 */}
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.secondaryText}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 하단 정보 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          총 {totalDuration}개의 활동으로 구성된 {totalPhases}단계 로드맵입니다
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    ...typography.h2,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stat: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    ...typography.h3,
    color: colors.deepMint,
    fontWeight: "700",
  },
  statLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.lightBlue,
    marginHorizontal: 20,
  },
  phasesContainer: {
    maxHeight: 400,
  },
  phaseItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.lightBlue,
  },
  selectedPhase: {
    borderColor: colors.deepMint,
    backgroundColor: colors.lightMint,
  },
  phaseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.deepMint,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  phaseNumberText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "700",
  },
  phaseContent: {
    flex: 1,
  },
  phaseTitle: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 4,
  },
  phaseDescription: {
    ...typography.body,
    color: colors.secondaryText,
    lineHeight: 18,
    marginBottom: 8,
  },
  milestonesContainer: {
    marginTop: 8,
  },
  milestonesLabel: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
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
    marginTop: 2,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightBlue,
  },
  footerText: {
    ...typography.caption,
    color: colors.secondaryText,
    textAlign: "center",
  },
});
