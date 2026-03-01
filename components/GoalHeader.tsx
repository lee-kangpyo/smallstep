import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

interface GoalHeaderProps {
  title: string;
  durationWeeks?: number;
  weeklyFrequency?: number;
}

export const GoalHeader: React.FC<GoalHeaderProps> = ({
  title,
  durationWeeks,
  weeklyFrequency,
}) => {
  return (
    <View style={styles.headerSection}>
      <Text style={styles.title}>{title}</Text>
      {(durationWeeks || weeklyFrequency) && (
        <View style={styles.infoRow}>
          {durationWeeks && (
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.secondaryText} />
              <Text style={styles.infoText}>{durationWeeks}주</Text>
            </View>
          )}
          {weeklyFrequency && (
            <View style={styles.infoItem}>
              <Ionicons name="repeat-outline" size={14} color={colors.secondaryText} />
              <Text style={styles.infoText}>주 {weeklyFrequency}회</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlue,
  },
  title: {
    ...typography.h2,
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.secondaryText,
    fontWeight: '500',
  },
});

