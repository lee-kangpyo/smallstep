import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CalendarDay, WeekData, MonthData } from "../utils/dateUtils";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface StampCalendarProps {
  data: MonthData | WeekData;
  onDayPress?: (day: CalendarDay) => void;
  viewMode: "week" | "month";
}

export const StampCalendar: React.FC<StampCalendarProps> = ({
  data,
  onDayPress,
  viewMode,
}) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const renderDay = (day: CalendarDay, index: number) => {
    const isWeekend = index === 0 || index === 6;

    return (
      <TouchableOpacity
        key={day.date.toISOString()}
        style={[
          styles.dayContainer,
          day.isToday && styles.todayContainer,
          !day.isCurrentMonth && styles.otherMonthDay,
        ]}
        onPress={() => onDayPress?.(day)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.dayText,
            day.isToday && styles.todayText,
            !day.isCurrentMonth && styles.otherMonthText,
            isWeekend && styles.weekendText,
          ]}
        >
          {day.day}
        </Text>

        {day.hasStamp && (
          <View style={styles.stampContainer}>
            <Text style={styles.stampText}>👣</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderWeek = (week: WeekData, weekIndex: number) => (
    <View key={weekIndex} style={styles.weekContainer}>
      {week.days.map((day, dayIndex) => renderDay(day, dayIndex))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {weekDays.map((day, index) => (
          <View key={day} style={styles.weekDayHeader}>
            <Text
              style={[
                styles.weekDayText,
                (index === 0 || index === 6) && styles.weekendText,
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 캘린더 본문 */}
      <View style={styles.calendarBody}>
        {viewMode === "month" && "weeks" in data
          ? data.weeks.map((week, index) => renderWeek(week, index))
          : "days" in data && renderWeek(data, 0)}
      </View>

      {/* 성공률 표시 */}
      <View style={styles.successRateContainer}>
        <Text style={styles.successRateText}>
          이번 {viewMode === "week" ? "주" : "달"} 성공률
        </Text>
        <Text style={styles.successRateNumber}>
          {Math.round(
            ((viewMode === "week" && "successCount" in data
              ? data.successCount
              : "totalSuccess" in data
              ? data.totalSuccess
              : 0) /
              data.totalDays) *
              100
          )}
          %
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "600",
  },
  weekendText: {
    color: colors.coralPink,
  },
  calendarBody: {
    marginBottom: 16,
  },
  weekContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayContainer: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    position: "relative",
  },
  dayText: {
    ...typography.caption,
    color: colors.primaryText,
    fontWeight: "500",
  },
  todayContainer: {
    backgroundColor: colors.lightBlue,
  },
  todayText: {
    color: colors.deepMint,
    fontWeight: "700",
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  otherMonthText: {
    color: colors.secondaryText,
  },
  stampContainer: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.coralPink,
    justifyContent: "center",
    alignItems: "center",
  },
  stampText: {
    fontSize: 8,
  },
  successRateContainer: {
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightBlue,
  },
  successRateText: {
    ...typography.caption,
    color: colors.secondaryText,
    marginBottom: 4,
  },
  successRateNumber: {
    ...typography.h2,
    color: colors.deepMint,
    fontWeight: "700",
  },
});
