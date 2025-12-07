import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { smallstepApi } from '../../services/api';
import { GoalTemplate } from '../../types/api';
import { Roadmap } from '../../types';
import { LoadingView } from './components/LoadingView';
import { ErrorView } from './components/ErrorView';
import { TemplateListView } from './components/TemplateListView';
import { TemplateDetailView } from './components/TemplateDetailView';

type GoalTemplateSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'GoalTemplateSelection'
>;

export const GoalTemplateSelectionScreen: React.FC = () => {
  const navigation = useNavigation<GoalTemplateSelectionScreenNavigationProp>();
  
  // 상태 관리
  const [templates, setTemplates] = useState<Record<string, GoalTemplate[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [templateDetail, setTemplateDetail] = useState<any>(null);

  // 초기 로드
  useEffect(() => {
    loadTemplates();
  }, []);

  // 비즈니스 로직: 템플릿 목록 로드
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

  // 비즈니스 로직: 템플릿 선택 및 상세 정보 로드
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

  // 비즈니스 로직: 계획 시작
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

  // 비즈니스 로직: 목록으로 돌아가기
  const handleBackToList = () => {
    setTemplateDetail(null);
    setSelectedTemplate(null);
  };

  // roadmap 변환 로직
  const getRoadmap = (): Roadmap | null => {
    if (!templateDetail) return null;
    
    const planData = templateDetail.detail?.plan_data;
    if (planData?.roadmap && planData?.schedule) {
      return {
        roadmap: planData.roadmap,
        schedule: planData.schedule,
      };
    }
    return null;
  };

  // 조건부 렌더링: Container는 컴포넌트 조합만 담당
  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadTemplates} />;
  }

  if (templateDetail) {
    return (
      <TemplateDetailView
        templateDetail={templateDetail}
        selectedTemplate={selectedTemplate}
        loadingDetail={loadingDetail}
        roadmap={getRoadmap()}
        onStart={handleStartWithTemplate}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <TemplateListView
      templates={templates}
      selectedTemplate={selectedTemplate}
      onTemplatePress={handleTemplatePress}
    />
  );
};

export default GoalTemplateSelectionScreen;

