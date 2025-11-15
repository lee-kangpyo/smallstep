import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { smallstepApi } from '../services/api';
import { GoalTemplate } from '../types/api';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

type GoalTemplateSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GoalTemplateSelection'
>;

export const GoalTemplateSelectionScreen: React.FC = () => {
  const navigation = useNavigation<GoalTemplateSelectionScreenNavigationProp>();
  const [templates, setTemplates] = useState<Record<string, GoalTemplate[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [templateDetail, setTemplateDetail] = useState<any>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await smallstepApi.getOnboardingTemplates();
      
      if (response.success && response.data) {
        setTemplates(response.data.categories);
      } else {
        setError(response.error || '템플릿을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      console.error('템플릿 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplatePress = async (template: GoalTemplate) => {
    try {
      setLoadingDetail(true);
      setSelectedTemplate(template);
      
      const response = await smallstepApi.getTemplatePreview(template.id);
      
      if (response.success && response.data) {
        setTemplateDetail(response.data);
      } else {
        Alert.alert('오류', '템플릿 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      Alert.alert('오류', '템플릿 정보를 불러오는데 실패했습니다.');
      console.error('템플릿 상세 조회 실패:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStartWithTemplate = () => {
    if (selectedTemplate && templateDetail) {
      // TODO: 로그인 화면으로 이동 또는 계획 확인 화면으로 이동
      Alert.alert(
        '로그인 필요',
        '계획을 저장하려면 로그인이 필요해요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '로그인', onPress: () => {
            // TODO: 로그인 화면으로 이동
            console.log('로그인 화면으로 이동');
          }}
        ]
      );
    }
  };

  const renderCategory = (categoryName: string, categoryTemplates: GoalTemplate[]) => (
    <View key={categoryName} style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      <View style={styles.templatesGrid}>
        {categoryTemplates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              selectedTemplate?.id === template.id && styles.selectedTemplateCard,
            ]}
            onPress={() => handleTemplatePress(template)}
          >
            <Text
              style={[
                styles.templateText,
                selectedTemplate?.id === template.id && styles.selectedTemplateText,
              ]}
            >
              {template.goal_text}
            </Text>
            
            {template.preview_data && (
              <View style={styles.previewInfo}>
                <Text style={styles.previewText}>
                  {template.preview_data.duration_weeks}주 • 주 {template.preview_data.weekly_frequency}회
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.deepMint} />
          <Text style={styles.loadingText}>템플릿을 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="다시 시도"
            onPress={loadTemplates}
            variant="primary"
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (templateDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.templateDetailContainer}>
            <Card variant="elevated" padding="large" style={styles.templateCard}>
              <Text style={styles.templateTitle}>{selectedTemplate?.goal_text}</Text>
              {templateDetail.detail && (
                <View style={styles.detailInfo}>
                  <Text style={styles.detailText}>
                    기간: {templateDetail.detail.duration_weeks}주
                  </Text>
                  <Text style={styles.detailText}>
                    주 {templateDetail.detail.weekly_frequency}회
                  </Text>
                </View>
              )}
            </Card>
            
            {loadingDetail && (
              <View style={styles.loadingDetailContainer}>
                <ActivityIndicator size="small" color={colors.deepMint} />
              </View>
            )}
            
            <Button
              title="이 계획으로 시작하기"
              onPress={handleStartWithTemplate}
              variant="accent"
              style={styles.startButton}
              disabled={loadingDetail}
            />
            
            <Text style={styles.loginHint}>
              계획을 저장하려면 로그인이 필요해요
            </Text>

            <Button
              title="다시 선택하기"
              onPress={() => {
                setTemplateDetail(null);
                setSelectedTemplate(null);
              }}
              variant="outline"
              style={styles.backButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🎯 목표를 선택해주세요</Text>
          <Text style={styles.subtitle}>
            원하는 목표를 선택하면 맞춤형 계획을 제안해드려요
          </Text>
        </View>

        {/* 템플릿 목록 */}
        {Object.entries(templates).map(([categoryName, categoryTemplates]) =>
          renderCategory(categoryName, categoryTemplates)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.secondaryText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 120,
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 16,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.lightBlue,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedTemplateCard: {
    borderColor: colors.deepMint,
    backgroundColor: colors.lightMint,
  },
  templateText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryText,
    lineHeight: 20,
    marginBottom: 8,
  },
  selectedTemplateText: {
    color: colors.deepMint,
    fontWeight: '600',
  },
  previewInfo: {
    marginTop: 4,
  },
  previewText: {
    fontSize: 12,
    color: colors.secondaryText,
  },
  templateDetailContainer: {
    padding: 20,
  },
  templateTitle: {
    ...typography.h2,
    color: colors.primaryText,
    marginBottom: 12,
    textAlign: 'center',
  },
  detailInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  detailText: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: 8,
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
