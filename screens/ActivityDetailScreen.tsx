import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useActivity, useGoal } from '../hooks/useQueries';
import { useUIActions } from '../hooks/useAppState';
import { Activity, Goal } from '../types/api';

interface ActivityDetailScreenProps {
  route: {
    params: {
      activityId: number;
      goalId: number;
    };
  };
}

export const ActivityDetailScreen: React.FC<ActivityDetailScreenProps> = ({ route }) => {
  const { activityId, goalId } = route.params;
  const navigation = useNavigation<any>();
  const { showToast } = useUIActions();
  
  // 데이터 조회
  const { data: activity, isLoading: activityLoading, error: activityError } = useActivity(activityId);
  const { data: goal } = useGoal(goalId);
  
  // 완료 상태 토글
  const [isCompleted, setIsCompleted] = useState(activity?.is_completed || false);

  // 완료 상태 변경
  const handleToggleCompletion = () => {
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    
    // TODO: 활동 완료 상태 업데이트 API 호출
    showToast(
      newStatus ? '활동을 완료했습니다!' : '활동을 미완료로 변경했습니다.',
      'success'
    );
  };

  // 활동 편집
  const handleEditActivity = () => {
    navigation.navigate('CreateActivity', { 
      goalId, 
      editMode: true, 
      activityId 
    });
  };

  // 활동 삭제
  const handleDeleteActivity = () => {
    Alert.alert(
      '활동 삭제',
      '정말로 이 활동을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            // TODO: 활동 삭제 API 호출
            showToast('활동이 삭제되었습니다.', 'success');
            navigation.goBack();
          }
        }
      ]
    );
  };

  if (activityLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>활동 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (activityError || !activity) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>활동 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 활동 정보 섹션 */}
      <View style={styles.activitySection}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditActivity}>
              <Text style={styles.editButtonText}>편집</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteActivity}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        {/* 완료 상태 토글 */}
        <View style={styles.completionSection}>
          <Text style={styles.completionLabel}>완료 상태</Text>
          <Switch
            value={isCompleted}
            onValueChange={handleToggleCompletion}
            trackColor={{ false: '#bdc3c7', true: '#27ae60' }}
            thumbColor={isCompleted ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* 활동 상세 정보 */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>활동 상세</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>활동 유형</Text>
          <Text style={styles.detailValue}>{activity.type}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>주차</Text>
          <Text style={styles.detailValue}>Week {activity.week}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>요일</Text>
          <Text style={styles.detailValue}>Day {activity.day}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>생성일</Text>
          <Text style={styles.detailValue}>
            {new Date(activity.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* 목표 정보 */}
      {goal && (
        <View style={styles.goalSection}>
          <Text style={styles.sectionTitle}>연결된 목표</Text>
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <View style={styles.goalProgress}>
              <Text style={styles.progressLabel}>진행률</Text>
              <Text style={styles.progressValue}>{goal.progress}%</Text>
            </View>
          </View>
        </View>
      )}

      {/* 진행 상황 */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>진행 상황</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${isCompleted ? 100 : 0}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {isCompleted ? '완료됨' : '진행 중'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#e74c3c',
    marginTop: 50,
  },
  activitySection: {
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    lineHeight: 24,
  },
  completionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  completionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  detailsSection: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  goalSection: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  goalDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  goalProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: '#95a5a6',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  progressSection: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#7f8c8d',
  },
});
