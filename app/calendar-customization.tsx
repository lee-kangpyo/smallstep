import React, { useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Roadmap } from '../types';
import { useCalendarCustomizationViewModel } from '../screens/CalendarCustomizationScreen/viewModel';
import { CalendarSection } from '../screens/CalendarCustomizationScreen/components/CalendarSection';
import { WeeklyPatternSection } from '../screens/CalendarCustomizationScreen/components/WeeklyPatternSection';
import { SaveButton } from '../screens/CalendarCustomizationScreen/components/SaveButton';
import { GoalHeader } from '../components/GoalHeader';
import { colors } from '../constants/colors';

interface TemplateData {
  title: string;
  description?: string;
  roadmap: Roadmap;
  durationWeeks?: number;
  weeklyFrequency?: number;
}

// Force cache refresh
export default function CalendarCustomizationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const templateData = params?.templateData
    ? (JSON.parse(params.templateData as string) as TemplateData)
    : null;

  React.useEffect(() => {
    if (!templateData) {
      Alert.alert('오류', '템플릿 데이터가 없습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    }
  }, [templateData, router]);

  if (!templateData) {
    return null;
  }

  const handleSaveComplete = useCallback(() => {
    // 저장 완료 후 홈 화면으로 이동
    router.replace('/(tabs)');
  }, [router]);

  const viewModel = useCalendarCustomizationViewModel({
    templateData,
    onSaveComplete: handleSaveComplete,
  });

  const handleSave = async () => {
    const success = await viewModel.handleSave();
    if (!success) {
      Alert.alert('오류', '목표 저장에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GoalHeader
        title={templateData.title}
        durationWeeks={templateData.durationWeeks}
        weeklyFrequency={templateData.weeklyFrequency}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CalendarSection
          startDate={viewModel.startDate}
          onDateSelect={viewModel.handleStartDateChange}
        />

        <WeeklyPatternSection
          weeklyPattern={viewModel.weeklyPattern}
          onPatternChange={viewModel.handleWeeklyPatternChange}
          weeklyFrequency={templateData.weeklyFrequency || 3}
        />
      </ScrollView>

      <SaveButton
        onPress={handleSave}
        disabled={!viewModel.canSave}
        loading={viewModel.isSaving}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
  },
});
