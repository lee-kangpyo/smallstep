import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";
import { ScheduleItem } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface ScheduleCardProps {
  scheduleItems: ScheduleItem[];
  onScheduleItemPress?: (item: ScheduleItem) => void;
  onScheduleItemDelete?: (item: ScheduleItem) => void;
  onScheduleItemMove?: (item: ScheduleItem, direction: "up" | "down") => void;
  editable?: boolean;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  scheduleItems,
  onScheduleItemPress,
  onScheduleItemDelete,
  onScheduleItemMove,
  editable = false,
}) => {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");

  // 주차별로 스케줄 그룹화
  const groupedByWeek = scheduleItems.reduce((acc, item) => {
    if (!acc[item.week]) {
      acc[item.week] = [];
    }
    acc[item.week].push(item);
    return acc;
  }, {} as Record<number, ScheduleItem[]>);

  // 주차별로 정렬
  const sortedWeeks = Object.keys(groupedByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  const handleDeleteItem = (item: ScheduleItem) => {
    Alert.alert("활동 삭제", `"${item.title}" 활동을 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => onScheduleItemDelete?.(item),
      },
    ]);
  };

  const handleMoveItem = (item: ScheduleItem, direction: "up" | "down") => {
    onScheduleItemMove?.(item, direction);
  };

  const renderWeeklyView = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {sortedWeeks.map((week) => (
        <Card
          key={week}
          variant="elevated"
          padding="medium"
          style={styles.weekCard}
        >
          <View style={styles.weekHeader}>
            <Text style={styles.weekTitle}>{week}주차</Text>
            <Text style={styles.weekCount}>
              {groupedByWeek[week].length}개 활동
            </Text>
          </View>

          {groupedByWeek[week]
            .sort((a, b) => a.day - b.day)
            .map((item, index) => (
              <View
                key={`${item.week}-${item.day}`}
                style={styles.scheduleItem}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemBadge}>
                    <Text style={styles.itemBadgeText}>{item.day}일차</Text>
                  </View>
                  <Text style={styles.itemType}>{item.activity_type}</Text>
                </View>

                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {item.description}
                </Text>

                {editable && (
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => onScheduleItemPress?.(item)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={16}
                        color={colors.deepMint}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteItem(item)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={16}
                        color={colors.coralPink}
                      />
                    </TouchableOpacity>
                    {index > 0 && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleMoveItem(item, "up")}
                      >
                        <Ionicons
                          name="arrow-up"
                          size={16}
                          color={colors.secondaryText}
                        />
                      </TouchableOpacity>
                    )}
                    {index < groupedByWeek[week].length - 1 && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleMoveItem(item, "down")}
                      >
                        <Ionicons
                          name="arrow-down"
                          size={16}
                          color={colors.secondaryText}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}
        </Card>
      ))}
    </ScrollView>
  );

  const renderMonthlyView = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card variant="elevated" padding="medium">
        <View style={styles.monthlyHeader}>
          <Text style={styles.monthlyTitle}>전체 스케줄</Text>
          <Text style={styles.monthlyCount}>
            총 {scheduleItems.length}개 활동
          </Text>
        </View>

        {scheduleItems
          .sort((a, b) => {
            if (a.week !== b.week) return a.week - b.week;
            return a.day - b.day;
          })
          .map((item, index) => (
            <View key={`${item.week}-${item.day}`} style={styles.monthlyItem}>
              <View style={styles.monthlyItemHeader}>
                <View style={styles.monthlyItemBadge}>
                  <Text style={styles.monthlyItemBadgeText}>
                    {item.week}주차 {item.day}일
                  </Text>
                </View>
                <Text style={styles.monthlyItemType}>{item.activity_type}</Text>
              </View>

              <Text style={styles.monthlyItemTitle}>{item.title}</Text>
              <Text style={styles.monthlyItemDescription} numberOfLines={2}>
                {item.description}
              </Text>

              {editable && (
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onScheduleItemPress?.(item)}
                  >
                    <Ionicons
                      name="create-outline"
                      size={16}
                      color={colors.deepMint}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteItem(item)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={colors.coralPink}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
      </Card>
    </ScrollView>
  );

  return (
    <View style={styles.wrapper}>
      {/* 뷰 모드 선택 */}
      <View style={styles.viewModeSelector}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === "weekly" && styles.viewModeButtonActive,
          ]}
          onPress={() => setViewMode("weekly")}
        >
          <Text
            style={[
              styles.viewModeText,
              viewMode === "weekly" && styles.viewModeTextActive,
            ]}
          >
            주간 보기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === "monthly" && styles.viewModeButtonActive,
          ]}
          onPress={() => setViewMode("monthly")}
        >
          <Text
            style={[
              styles.viewModeText,
              viewMode === "monthly" && styles.viewModeTextActive,
            ]}
          >
            전체 보기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 스케줄 내용 */}
      {viewMode === "weekly" ? renderWeeklyView() : renderMonthlyView()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  viewModeSelector: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  viewModeButtonActive: {
    backgroundColor: colors.deepMint,
  },
  viewModeText: {
    ...typography.body,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  viewModeTextActive: {
    color: colors.white,
    fontWeight: "600",
  },
  container: {
    flex: 1,
  },
  weekCard: {
    marginBottom: 16,
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weekTitle: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
  },
  weekCount: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  scheduleItem: {
    backgroundColor: colors.warmGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  itemBadge: {
    backgroundColor: colors.deepMint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  itemBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  itemType: {
    ...typography.caption,
    color: colors.secondaryText,
    fontStyle: "italic",
  },
  itemTitle: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "500",
    marginBottom: 4,
  },
  itemDescription: {
    ...typography.caption,
    color: colors.secondaryText,
    lineHeight: 16,
  },
  itemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  monthlyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthlyTitle: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
  },
  monthlyCount: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  monthlyItem: {
    backgroundColor: colors.warmGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  monthlyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  monthlyItemBadge: {
    backgroundColor: colors.deepMint,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  monthlyItemBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "600",
  },
  monthlyItemType: {
    ...typography.caption,
    color: colors.secondaryText,
    fontStyle: "italic",
  },
  monthlyItemTitle: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "500",
    marginBottom: 4,
  },
  monthlyItemDescription: {
    ...typography.caption,
    color: colors.secondaryText,
    lineHeight: 16,
  },
});
