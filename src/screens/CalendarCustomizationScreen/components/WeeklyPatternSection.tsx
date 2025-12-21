import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WeeklyPattern } from '../../../../types';
import { colors } from '../../../constants/colors';

interface WeeklyPatternSectionProps {
  weeklyPattern: WeeklyPattern | null;
  onPatternChange: (pattern: WeeklyPattern) => void;
  weeklyFrequency: number; // 템플릿에서 결정된 주 횟수
}

const DAYS = [
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
  { value: 6, label: '토' },
  { value: 7, label: '일' },
];

export const WeeklyPatternSection: React.FC<WeeklyPatternSectionProps> = ({
  weeklyPattern,
  onPatternChange,
  weeklyFrequency,
}) => {

  const handleDayToggle = (dayValue: number) => {
    if (!weeklyPattern) return;

    const currentDays = weeklyPattern.selectedDays;
    const isSelected = currentDays.includes(dayValue);

    if (isSelected) {
      // 선택 해제 (항상 가능)
      onPatternChange({
        ...weeklyPattern,
        selectedDays: currentDays.filter((d) => d !== dayValue),
      });
    } else {
      // 선택 추가 (최대 weeklyFrequency 개수까지만)
      if (currentDays.length < weeklyFrequency) {
        onPatternChange({
          ...weeklyPattern,
          selectedDays: [...currentDays, dayValue].sort((a, b) => a - b),
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>주간 패턴 설정</Text>

      {/* 주 횟수 표시 (읽기 전용) */}
      <View style={styles.section}>
        <Text style={styles.label}>주 {weeklyFrequency}회</Text>
        <Text style={styles.frequencyInfo}>
          {weeklyFrequency}개의 요일을 선택해주세요
        </Text>
      </View>

      {/* 요일 선택 */}
      {weeklyPattern && (
        <View style={styles.section}>
          <Text style={styles.label}>어떤 요일?</Text>
          <View style={styles.daysContainer}>
            {DAYS.map((day) => {
              const isSelected = weeklyPattern.selectedDays.includes(day.value);
              return (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    isSelected && styles.dayButtonActive,
                  ]}
                  onPress={() => handleDayToggle(day.value)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
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
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryText,
    marginBottom: 12,
  },
  frequencyInfo: {
    fontSize: 13,
    color: colors.secondaryText,
    marginTop: 4,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.warmGray,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: colors.deepMint,
    borderColor: colors.deepMint,
  },
  dayText: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '500',
  },
  dayTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
});

