import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGoal, useActivities } from '../hooks/useQueries';
import { useUIActions } from '../hooks/useAppState';
import { ActivityTracker } from '../components/ActivityTracker';
import { AIFeedback } from '../components/AIFeedback';
import { Goal, Activity } from '../types/api';

interface GoalDetailScreenProps {
  route: {
    params: {
      goalId: number;
      userId: number;
    };
  };
}

export const GoalDetailScreen: React.FC<GoalDetailScreenProps> = ({ route }) => {
  const { goalId, userId } = route.params;
  const navigation = useNavigation<any>();
  const { showToast } = useUIActions();
  
  // 데이터 조회
  const { data: goal, isLoading: goalLoading, error: goalError } = useGoal(goalId);
  const { data: activities, isLoading: activitiesLoading } = useActivities(goalId);
  
  // 편집 모드 상태
  const [isEditing, setIsEditing] = useState(false);

  // 활동 클릭 핸들러
  const handleActivityPress = (activity: Activity) => {
    navigation.navigate('ActivityDetail', { 
      activityId: activity.id, 
      goalId: activity.goal_id 
    });
  };

  // 새 활동 생성
  const handleCreateActivity = () => {
    navigation.navigate('CreateActivity', { goalId });
  };

  // 목표 편집
  const handleEditGoal = () => {
    navigation.navigate('CreateGoal', { 
      userId, 
      editMode: true, 
      goalId 
    });
  };

  // 목표 삭제
  const handleDeleteGoal = () => {
    Alert.alert(
      '목표 삭제',
      '정말로 이 목표를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            // TODO: 목표 삭제 API 호출
            showToast('목표가 삭제되었습니다.', 'success');
            navigation.goBack();
          }
        }
      ]
    );
  };

  if (goalLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>목표 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (goalError || !goal) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>목표 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 목표 정보 섹션 */}
      <View style={styles.goalSection}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditGoal}>
              <Text style={styles.editButtonText}>편집</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGoal}>
              <Text style={styles.deleteButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.goalDescription}>{goal.description}</Text>
        
        <View style={styles.goalStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>카테고리</Text>
            <Text style={styles.statValue}>{goal.category}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>진행률</Text>
            <Text style={styles.statValue}>{goal.progress}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>상태</Text>
            <Text style={[styles.statValue, styles.statusText]}>
              {goal.status}
            </Text>
          </View>
        </View>
      </View>

      {/* 활동 섹션 */}
      <View style={styles.activitiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>활동 목록</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleCreateActivity}>
            <Text style={styles.addButtonText}>+ 새 활동</Text>
          </TouchableOpacity>
        </View>
        
        <ActivityTracker 
          goalId={goalId}
          onActivityPress={handleActivityPress}
        />
      </View>

      {/* AI 피드백 섹션 */}
      <View style={styles.feedbackSection}>
        <Text style={styles.sectionTitle}>AI 피드백</Text>
        <AIFeedback 
          completedActivities={activities?.map(a => a.title) || []}
          currentProgress={goal.progress}
        />
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
  goalSection: {
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
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalTitle: {
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
  goalDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    lineHeight: 24,
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#95a5a6',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusText: {
    color: '#27ae60',
  },
  activitiesSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackSection: {
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
});
