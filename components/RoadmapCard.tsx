import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Roadmap, Phase, ScheduleItem } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import { PhaseScheduleModal } from "../screens/GoalTemplateSelectionScreen/components/PhaseScheduleModal";

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
  const [selectedPhaseForModal, setSelectedPhaseForModal] = useState<Phase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const totalPhases = roadmap.roadmap.length;
  const totalDuration = roadmap.schedule.length;

  const handleViewSchedule = (phase: Phase) => {
    setSelectedPhaseForModal(phase);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPhaseForModal(null);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>로드맵</Text>
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
      <View style={styles.phasesContainer}>
        {roadmap.roadmap.map((phase, index) => (
          <View
            key={phase.phase}
            style={[
              styles.phaseItem,
              selectedPhase === phase.phase && styles.selectedPhase,
            ]}
          >
            {/* 단계 번호 */}
            <View style={styles.phaseNumber}>
              <Text style={styles.phaseNumberText}>{phase.phase}</Text>
            </View>

            {/* 단계 내용 */}
            <View style={styles.phaseContent}>
              <Text style={styles.phaseTitle}>{phase.phase_title}</Text>
              <Text style={styles.phaseDescription}>
                {phase.phase_description}
              </Text>

              {/* 주요 마일스톤 */}
              {phase.key_milestones.length > 0 && (
                <View style={styles.milestonesContainer}>
                  <Text style={styles.milestonesLabel}>주요 마일스톤:</Text>
                  {phase.key_milestones.map((milestone, idx) => (
                    <View key={idx} style={styles.milestoneItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={12}
                        color={colors.deepMint}
                      />
                      <Text style={styles.milestoneText}>
                        {milestone}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* 활동 보기 버튼 */}
              <TouchableOpacity
                style={styles.viewScheduleButton}
                onPress={() => handleViewSchedule(phase)}
                activeOpacity={0.7}
              >
                <Text style={styles.viewScheduleButtonText}>
                  활동 {roadmap.schedule.filter(s => s.phase_link === phase.phase).length}개 보기
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.deepMint}
                />
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </View>

      {/* 하단 정보 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          총 {totalDuration}개의 활동으로 구성된 {totalPhases}단계 로드맵입니다
        </Text>
      </View>

      {/* 스케줄 모달 */}
      <PhaseScheduleModal
        visible={modalVisible}
        phase={selectedPhaseForModal}
        scheduleItems={roadmap.schedule}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    // 높이 제한 제거 - 전체 내용 표시
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
  viewScheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.lightMint,
    borderRadius: 8,
  },
  viewScheduleButtonText: {
    ...typography.body,
    color: colors.deepMint,
    fontWeight: '600',
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
