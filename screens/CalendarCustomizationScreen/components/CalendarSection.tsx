import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '../../../constants/colors';

interface CalendarSectionProps {
  startDate: string | null;
  onDateSelect: (date: string) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  startDate,
  onDateSelect,
}) => {
  // 로컬 시간대를 유지하면서 오늘 날짜를 YYYY-MM-DD 형식으로 변환
  const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const today = getLocalDateString(todayDate);

  const handleDayPress = (day: { dateString: string }) => {
    onDateSelect(day.dateString);
  };

  // 선택한 날짜가 속한 주의 모든 날짜를 하이라이트 (일요일 시작)
  const getWeekDates = (dateString: string): string[] => {
    const date = new Date(dateString + 'T00:00:00'); // 로컬 시간으로 파싱
    const dayOfWeek = date.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek); // 일요일로 맞춤
    
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(getLocalDateString(weekDate));
    }
    return weekDates;
  };

  const markedDates: any = {};
  
  // 오늘 날짜 강조 (선택된 주에 포함되지 않은 경우)
  if (!startDate || !getWeekDates(startDate).includes(today)) {
    markedDates[today] = {
      marked: true,
      dotColor: colors.deepMint,
      selected: false,
    };
  }
  
  if (startDate) {
    const weekDates = getWeekDates(startDate);
    weekDates.forEach((date) => {
      // 오늘 날짜가 선택된 주에 포함되어 있으면 선택 스타일 적용
      if (date === today) {
        markedDates[date] = {
          selected: true,
          selectedColor: colors.deepMint,
          selectedTextColor: colors.white,
          marked: true,
          dotColor: colors.white,
        };
      } else {
        // 주 전체를 같은 색으로 표시하여 주차 선택 느낌을 줌
        markedDates[date] = {
          selected: true,
          selectedColor: date === startDate ? colors.deepMint : colors.lightMint,
          selectedTextColor: date === startDate ? colors.white : colors.deepMint,
        };
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>시작 주차 선택</Text>
      <Text style={styles.subtitle}>
        시작하고 싶은 주의 첫 번째 날짜를 선택해주세요
      </Text>
      <Calendar
        current={today}
        minDate={today}
        onDayPress={handleDayPress}
        markedDates={markedDates}
        monthFormat={'yyyy년 M월'}
        locale={'ko'}
        firstDay={0}
        enableSwipeMonths={true}
        theme={{
          backgroundColor: colors.white,
          calendarBackground: colors.white,
          textSectionTitleColor: colors.primaryText,
          selectedDayBackgroundColor: colors.deepMint,
          selectedDayTextColor: colors.white,
          todayTextColor: colors.deepMint,
          dayTextColor: colors.primaryText,
          textDisabledColor: colors.secondaryText,
          dotColor: colors.deepMint,
          selectedDotColor: colors.white,
          arrowColor: colors.deepMint,
          monthTextColor: colors.primaryText,
          indicatorColor: colors.deepMint,
          textDayFontWeight: '500',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
        style={styles.calendar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
  },
});

