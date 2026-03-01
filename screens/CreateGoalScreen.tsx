import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCreateGoal, useGoal, useGoalAnalysis } from '../hooks/useQueries';
import { useUIActions } from '../hooks/useAppState';
import { GoalCreate } from '../types/api';

interface CreateGoalScreenProps {
  route: {
    params: {
      userId: number;
      editMode?: boolean;
      goalId?: number;
    };
  };
}

export const CreateGoalScreen: React.FC<CreateGoalScreenProps> = ({ route }) => {
  const { userId, editMode = false, goalId } = route.params;
  const navigation = useNavigation<any>();
  const { showToast } = useUIActions();
  
  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration_weeks: 4,
    weekly_frequency: 3,
  });
  
  // 편집 모드일 때 기존 데이터 로드
  const { data: existingGoal } = useGoal(goalId || 0);
  const createGoalMutation = useCreateGoal();
  const goalAnalysisMutation = useGoalAnalysis();
  
  // 편집 모드일 때 기존 데이터 설정
  useEffect(() => {
    if (editMode && existingGoal) {
      setFormData({
        title: existingGoal.title,
        description: existingGoal.description,
        category: existingGoal.category,
        duration_weeks: existingGoal.duration_weeks || 4,
        weekly_frequency: existingGoal.weekly_frequency || 3,
      });
    }
  }, [editMode, existingGoal]);

  // 폼 입력 핸들러
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 유효성 검사
  const validateForm = () => {
    if (!formData.title.trim()) {
      showToast('목표 제목을 입력해주세요.', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      showToast('목표 설명을 입력해주세요.', 'error');
      return false;
    }
    if (!formData.category.trim()) {
      showToast('카테고리를 선택해주세요.', 'error');
      return false;
    }
    if (formData.duration_weeks < 1 || formData.duration_weeks > 52) {
      showToast('기간은 1-52주 사이로 설정해주세요.', 'error');
      return false;
    }
    if (formData.weekly_frequency < 1 || formData.weekly_frequency > 7) {
      showToast('주간 빈도는 1-7회 사이로 설정해주세요.', 'error');
      return false;
    }
    return true;
  };

  // 목표 분석
  const handleAnalyzeGoal = async () => {
    if (!validateForm()) return;
    
    try {
      const analysisData = {
        goal: formData.title,
        duration_weeks: formData.duration_weeks,
        weekly_frequency: formData.weekly_frequency,
      };
      
      const result = await goalAnalysisMutation.mutateAsync(analysisData);
      showToast('목표 분석이 완료되었습니다!', 'success');
      
      // 분석 결과를 폼에 반영
      if (result.activities) {
        setFormData(prev => ({
          ...prev,
          description: result.activities.join('\n'),
        }));
      }
    } catch (error) {
      showToast('목표 분석 중 오류가 발생했습니다.', 'error');
    }
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const goalData: GoalCreate = {
        user_id: userId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        duration_weeks: formData.duration_weeks,
        weekly_frequency: formData.weekly_frequency,
      };
      
      await createGoalMutation.mutateAsync(goalData);
      
      showToast(
        editMode ? '목표가 수정되었습니다!' : '새 목표가 생성되었습니다!',
        'success'
      );
      
      navigation.goBack();
    } catch (error) {
      showToast('목표 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  // 취소 핸들러
  const handleCancel = () => {
    Alert.alert(
      '작성 취소',
      '작성 중인 내용이 사라집니다. 정말 취소하시겠습니까?',
      [
        { text: '계속 작성', style: 'cancel' },
        { 
          text: '취소', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* 제목 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>목표 제목 *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="달성하고 싶은 목표를 입력하세요"
              maxLength={100}
            />
          </View>

          {/* 설명 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>목표 설명 *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="목표에 대한 자세한 설명을 입력하세요"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
          </View>

          {/* 카테고리 선택 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>카테고리 *</Text>
            <View style={styles.categoryContainer}>
              {['건강', '학습', '취미', '업무', '관계', '재정'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    formData.category === category && styles.categoryButtonActive
                  ]}
                  onPress={() => handleInputChange('category', category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    formData.category === category && styles.categoryButtonTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 기간 설정 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>목표 기간 (주) *</Text>
            <View style={styles.numberInputContainer}>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handleInputChange('duration_weeks', Math.max(1, formData.duration_weeks - 1))}
              >
                <Text style={styles.numberButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.numberDisplay}>{formData.duration_weeks}주</Text>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handleInputChange('duration_weeks', Math.min(52, formData.duration_weeks + 1))}
              >
                <Text style={styles.numberButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 주간 빈도 설정 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>주간 활동 빈도 (회) *</Text>
            <View style={styles.numberInputContainer}>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handleInputChange('weekly_frequency', Math.max(1, formData.weekly_frequency - 1))}
              >
                <Text style={styles.numberButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.numberDisplay}>{formData.weekly_frequency}회</Text>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handleInputChange('weekly_frequency', Math.min(7, formData.weekly_frequency + 1))}
              >
                <Text style={styles.numberButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AI 분석 버튼 */}
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={handleAnalyzeGoal}
            disabled={goalAnalysisMutation.isPending}
          >
            <Text style={styles.analyzeButtonText}>
              {goalAnalysisMutation.isPending ? '분석 중...' : '🤖 AI로 목표 분석하기'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={createGoalMutation.isPending}
        >
          <Text style={styles.saveButtonText}>
            {createGoalMutation.isPending ? '저장 중...' : (editMode ? '수정' : '저장')}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2c3e50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  numberButton: {
    backgroundColor: '#ecf0f1',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  numberDisplay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    paddingVertical: 12,
  },
  analyzeButton: {
    backgroundColor: '#9b59b6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
