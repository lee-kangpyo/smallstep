import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile } from './UserProfile';
import { GoalList } from '../GoalList';
import { ActivityTracker } from '../ActivityTracker';
import { AIFeedback } from '../AIFeedback';
import { useUIActions, useToast } from '../../hooks/useAppState';
import { Goal, Activity } from '../../types/api';

interface HomeScreenProps {
  userId: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userId }) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const { showToast } = useUIActions();
  const toast = useToast();

  const handleGoalPress = (goal: Goal) => {
    setSelectedGoal(goal);
    setSelectedActivity(null);
    setShowFeedback(false);
    showToast(`${goal.title} 선택됨`, 'info');
  };

  const handleActivityPress = (activity: Activity) => {
    setSelectedActivity(activity);
    showToast(`${activity.title} 선택됨`, 'info');
  };

  const handleFeedbackGenerated = (feedback: any) => {
    showToast('AI 피드백이 생성되었습니다!', 'success');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SmallStep</Text>
          <Text style={styles.headerSubtitle}>작은 걸음으로 큰 변화를</Text>
        </View>

        {/* 사용자 프로필 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 내 프로필</Text>
          <UserProfile userId={userId} />
        </View>

        {/* 목표 목록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 내 목표</Text>
          <GoalList userId={userId} onGoalPress={handleGoalPress} />
        </View>

        {/* 선택된 목표의 활동 추적 */}
        {selectedGoal && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📋 {selectedGoal.title} 활동 추적
            </Text>
            <ActivityTracker 
              goalId={selectedGoal.id} 
              onActivityPress={handleActivityPress}
            />
          </View>
        )}

        {/* AI 피드백 */}
        {selectedGoal && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🤖 AI 피드백</Text>
            <AIFeedback 
              feedbackData={{
                user_id: userId,
                goal_id: selectedGoal.id,
                completed_activities: [selectedGoal.title], // 실제로는 완료된 활동 목록
                current_progress: selectedGoal.progress,
              }}
              onFeedbackGenerated={handleFeedbackGenerated}
            />
          </View>
        )}

        {/* 빠른 액션 버튼들 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ 빠른 액션</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showToast('새 목표 생성', 'info')}
            >
              <Text style={styles.actionButtonText}>새 목표</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showToast('활동 완료', 'info')}
            >
              <Text style={styles.actionButtonText}>활동 완료</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => showToast('통계 보기', 'info')}
            >
              <Text style={styles.actionButtonText}>통계</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 토스트 메시지 */}
      {toast && toast.visible && (
        <View style={[styles.toast, styles[`toast${toast.type}`]]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </SafeAreaView>
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
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
  },
  toast: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toastsuccess: {
    backgroundColor: '#27ae60',
  },
  toasterror: {
    backgroundColor: '#e74c3c',
  },
  toastinfo: {
    backgroundColor: '#3498db',
  },
  toastwarning: {
    backgroundColor: '#f39c12',
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
