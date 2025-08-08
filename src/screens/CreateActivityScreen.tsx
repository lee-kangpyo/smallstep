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
import { useCreateActivity, useActivity, useGoal } from '../hooks/useQueries';
import { useUIActions } from '../hooks/useAppState';
import { ActivityCreate } from '../types/api';

interface CreateActivityScreenProps {
  route: {
    params: {
      goalId: number;
      editMode?: boolean;
      activityId?: number;
    };
  };
}

export const CreateActivityScreen: React.FC<CreateActivityScreenProps> = ({ route }) => {
  const { goalId, editMode = false, activityId } = route.params;
  const navigation = useNavigation<any>();
  const { showToast } = useUIActions();
  
  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    week: 1,
    day: 1,
  });
  
  // 편집 모드일 때 기존 데이터 로드
  const { data: existingActivity } = useActivity(activityId || 0);
  const { data: goal } = useGoal(goalId);
  const createActivityMutation = useCreateActivity();
  
  // 편집 모드일 때 기존 데이터 설정
  useEffect(() => {
    if (editMode && existingActivity) {
      setFormData({
        title: existingActivity.title,
        description: existingActivity.description,
        type: existingActivity.type,
        week: existingActivity.week,
        day: existingActivity.day,
      });
    }
  }, [editMode, existingActivity]);

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
      showToast('활동 제목을 입력해주세요.', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      showToast('활동 설명을 입력해주세요.', 'error');
      return false;
    }
    if (!formData.type.trim()) {
      showToast('활동 유형을 선택해주세요.', 'error');
      return false;
    }
    if (formData.week < 1 || formData.week > 52) {
      showToast('주차는 1-52주 사이로 설정해주세요.', 'error');
      return false;
    }
    if (formData.day < 1 || formData.day > 7) {
      showToast('요일은 1-7일 사이로 설정해주세요.', 'error');
      return false;
    }
    return true;
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const activityData: ActivityCreate = {
        goal_id: goalId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type.trim(),
        week: formData.week,
        day: formData.day,
      };
      
      await createActivityMutation.mutateAsync(activityData);
      
      showToast(
        editMode ? '활동이 수정되었습니다!' : '새 활동이 생성되었습니다!',
        'success'
      );
      
      navigation.goBack();
    } catch (error) {
      showToast('활동 저장 중 오류가 발생했습니다.', 'error');
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
          {/* 목표 정보 표시 */}
          {goal && (
            <View style={styles.goalInfo}>
              <Text style={styles.goalInfoTitle}>연결된 목표</Text>
              <Text style={styles.goalInfoText}>{goal.title}</Text>
            </View>
          )}

          {/* 제목 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>활동 제목 *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="수행할 활동을 입력하세요"
              maxLength={100}
            />
          </View>

          {/* 설명 입력 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>활동 설명 *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="활동에 대한 자세한 설명을 입력하세요"
              multiline
              numberOfLines={4}
              maxLength={300}
            />
          </View>

          {/* 활동 유형 선택 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>활동 유형 *</Text>
            <View style={styles.typeContainer}>
              {['운동', '학습', '독서', '명상', '창작', '정리', '기타'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => handleInputChange('type', type)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.type === type && styles.typeButtonTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 주차 설정 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>주차 *</Text>
            <View style={styles.numberInputContainer}>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handleInputChange('week', Math.max(1, formData.week - 1))}
              >
                <Text style={styles.numberButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.numberDisplay}>{formData.week}주차</Text>
              <TouchableOpacity
                style={styles.numberButton}
                onPress={() => handleInputChange('week', Math.min(52, formData.week + 1))}
              >
                <Text style={styles.numberButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 요일 설정 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>요일 *</Text>
            <View style={styles.dayContainer}>
              {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    formData.day === index + 1 && styles.dayButtonActive
                  ]}
                  onPress={() => handleInputChange('day', index + 1)}
                >
                  <Text style={[
                    styles.dayButtonText,
                    formData.day === index + 1 && styles.dayButtonTextActive
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
          disabled={createActivityMutation.isPending}
        >
          <Text style={styles.saveButtonText}>
            {createActivityMutation.isPending ? '저장 중...' : (editMode ? '수정' : '저장')}
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
  goalInfo: {
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  goalInfoTitle: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 5,
  },
  goalInfoText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
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
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  typeButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  typeButtonTextActive: {
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
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 4,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
  },
  dayButtonActive: {
    backgroundColor: '#3498db',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  dayButtonTextActive: {
    color: 'white',
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
