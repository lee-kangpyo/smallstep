import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoalTemplate } from '../../../types/api';
import { Roadmap } from '../../../types';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { RoadmapCard } from '../../../components/RoadmapCard';
import { GoalHeader } from '../../../components/GoalHeader';
import { colors } from '../../../constants/colors';

interface TemplateDetailViewProps {
  templateDetail: any; // TODO: 타입 정의 필요
  selectedTemplate: GoalTemplate | null;
  loadingDetail: boolean;
  roadmap: Roadmap | null;
  onStart: () => void;
  onBack: () => void;
}

export const TemplateDetailView: React.FC<TemplateDetailViewProps> = ({
  templateDetail,
  selectedTemplate,
  loadingDetail,
  roadmap,
  onStart,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 영역 - 전체 너비 */}
      <GoalHeader
        title={selectedTemplate?.goal_text || ''}
        durationWeeks={templateDetail.detail?.duration_weeks}
        weeklyFrequency={templateDetail.detail?.weekly_frequency}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.templateDetailContainer}>
          
          {loadingDetail && (
            <View style={styles.loadingDetailContainer}>
              <ActivityIndicator size="small" color={colors.deepMint} />
            </View>
          )}

          {/* 전체 커리큘럼 표시 */}
          {roadmap && !loadingDetail && (
            <RoadmapCard roadmap={roadmap} />
          )}
          
          <Button
            title="이 계획으로 시작하기"
            onPress={onStart}
            variant="accent"
            style={styles.startButton}
            disabled={loadingDetail}
          />

          <Button
            title="다시 선택하기"
            onPress={onBack}
            variant="outline"
            style={styles.backButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
  },
  headerSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlue,
  },
  scrollView: {
    flex: 1,
  },
  templateDetailContainer: {
    padding: 0,
  },
  loadingDetailContainer: {
    padding: 20,
    alignItems: 'center',
  },
  startButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  backButton: {
    marginTop: 12,
  },
});

