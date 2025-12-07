import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GoalTemplate } from '../../../types/api';
import { Roadmap } from '../../../types';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { RoadmapCard } from '../../../components/RoadmapCard';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

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
      <View style={styles.headerSection}>
        <Text style={styles.templateTitle}>{selectedTemplate?.goal_text}</Text>
        {templateDetail.detail && (
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.secondaryText} />
              <Text style={styles.infoText}>
                {templateDetail.detail.duration_weeks}주
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="repeat-outline" size={14} color={colors.secondaryText} />
              <Text style={styles.infoText}>
                주 {templateDetail.detail.weekly_frequency}회
              </Text>
            </View>
          </View>
        )}
      </View>

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
          
          <Text style={styles.loginHint}>
            계획을 저장하려면 로그인이 필요해요
          </Text>

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
  templateTitle: {
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
  loadingDetailContainer: {
    padding: 20,
    alignItems: 'center',
  },
  startButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  loginHint: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 12,
  },
});

