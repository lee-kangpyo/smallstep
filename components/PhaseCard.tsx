import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { Phase, ScheduleItem } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface PhaseCardProps {
  phase: Phase;
  scheduleItems?: ScheduleItem[];
  isExpanded?: boolean;
  onPress?: () => void;
  onScheduleItemPress?: (item: ScheduleItem) => void;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  scheduleItems = [],
  isExpanded = false,
  onPress,
  onScheduleItemPress,
}) => {
  const phaseScheduleItems = scheduleItems.filter(
    (item) => item.phase_link === phase.phase
  );

  return (
    <Card variant="elevated" padding="medium" style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* 단계 번호 */}
        <View style={styles.phaseNumber}>
          <Text style={styles.phaseNumberText}>{phase.phase}</Text>
        </View>

        {/* 단계 정보 */}
        <View style={styles.phaseInfo}>
          <Text style={styles.phaseTitle}>{phase.phase_title}</Text>
          <Text style={styles.phaseDescription} numberOfLines={2}>
            {phase.phase_description}
          </Text>
        </View>

        {/* 확장/축소 아이콘 */}
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.secondaryText}
        />
      </TouchableOpacity>

      {/* 확장된 내용 */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* 주요 마일스톤 */}
          {phase.key_milestones.length > 0 && (
            <View style={styles.milestonesSection}>
              <Text style={styles.sectionTitle}>주요 마일스톤</Text>
              {phase.key_milestones.map((milestone, index) => (
                <View key={index} style={styles.milestoneItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={colors.deepMint}
                  />
                  <Text style={styles.milestoneText}>{milestone}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 스케줄 아이템들 */}
          {phaseScheduleItems.length > 0 && (
            <View style={styles.scheduleSection}>
              <Text style={styles.sectionTitle}>
                활동 ({phaseScheduleItems.length}개)
              </Text>
              <ScrollView
                style={styles.scheduleList}
                showsVerticalScrollIndicator={false}
              >
                {phaseScheduleItems.map((item, index) => (
                  <TouchableOpacity
                    key={`${item.week}-${item.day}`}
                    style={styles.scheduleItem}
                    onPress={() => onScheduleItemPress?.(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.scheduleItemHeader}>
                      <View style={styles.scheduleItemBadge}>
                        <Text style={styles.scheduleItemBadgeText}>
                          {item.week}주차 {item.day}일
                        </Text>
                      </View>
                      <Text style={styles.scheduleItemType}>
                        {item.activity_type}
                      </Text>
                    </View>
                    <Text style={styles.scheduleItemTitle}>{item.title}</Text>
                    <Text
                      style={styles.scheduleItemDescription}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  phaseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.deepMint,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  phaseNumberText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "700",
  },
  phaseInfo: {
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
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightBlue,
  },
  milestonesSection: {
    marginBottom: 16,
  },
  scheduleSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    ...typography.h5,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 8,
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  milestoneText: {
    ...typography.body,
    color: colors.primaryText,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  scheduleList: {
    maxHeight: 200,
  },
  scheduleItem: {
    backgroundColor: colors.warmGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  scheduleItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  scheduleItemBadge: {
    backgroundColor: colors.deepMint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  scheduleItemBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  scheduleItemType: {
    ...typography.caption,
    color: colors.secondaryText,
    fontStyle: "italic",
  },
  scheduleItemTitle: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "500",
    marginBottom: 4,
  },
  scheduleItemDescription: {
    ...typography.caption,
    color: colors.secondaryText,
    lineHeight: 16,
  },
});
