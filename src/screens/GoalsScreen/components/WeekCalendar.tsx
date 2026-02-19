import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CalendarDay } from "../../../utils/dateUtils";
import { colors } from "../../../constants/colors";
import { typography } from "../../../constants/typography";

interface WeekCalendarProps {
  weekData: { days: CalendarDay[] };
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  weekData,
  selectedDate,
  onDateSelect,
}) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 주간 캘린더의 첫 번째 날(일요일)로부터 년도와 월 추출
  const firstDay = weekData.days[0]?.date;
  const year = firstDay?.getFullYear();
  const month = firstDay
    ? firstDay.getMonth() + 1
    : new Date().getMonth() + 1;
  const calendarTitle =
    year && month ? `${year}년 ${month}월` : "이번 주";

  return (
    <View style={styles.calendarContainer}>
      <Text style={styles.sectionTitle}>{calendarTitle}</Text>
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
      <View style={styles.weekDays}>
        {weekData.days.map((day: CalendarDay, index: number) => {
          const isWeekend = index === 0 || index === 6;
          const isSelected =
            selectedDate.toDateString() === day.date.toDateString();
          return (
            <TouchableOpacity
              key={day.date.toISOString()}
              style={[
                styles.dayContainer,
                day.isToday && styles.todayContainer,
                isSelected && !day.isToday && styles.selectedDay,
              ]}
              onPress={() => onDateSelect(day.date)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  day.isToday && styles.todayText,
                  isSelected && !day.isToday && styles.selectedDayText,
                  isWeekend &&
                    !day.isToday &&
                    !isSelected &&
                    styles.weekendText,
                ]}
              >
                {day.day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
  },
  weekHeader: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 8,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  weekendText: {
    color: colors.deepMint,
  },
  weekDays: {
    flexDirection: "row",
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  todayContainer: {
    backgroundColor: colors.deepMint,
  },
  selectedDay: {
    backgroundColor: colors.lightBlue,
    borderWidth: 2,
    borderColor: colors.deepMint,
  },
  selectedDayText: {
    color: colors.deepMint,
    fontWeight: "600",
  },
  dayText: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "500",
  },
  todayText: {
    color: colors.white,
    fontWeight: "600",
  },
});

