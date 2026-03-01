import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useActivities } from '../hooks/useQueries';
import { useUIActions } from '../hooks/useAppState';
import { Activity } from '../types/api';

interface ActivityTrackerProps {
  goalId: number;
  onActivityPress?: (activity: Activity) => void;
}

interface ActivityItemProps {
  activity: Activity;
  onPress: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onPress }) => {
  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'exercise': return '#e74c3c';
      case 'study': return '#3498db';
      case 'work': return '#f39c12';
      case 'hobby': return '#9b59b6';
      default: return '#7f8c8d';
    }
  };

  const getActivityTypeText = (type: string) => {
    switch (type) {
      case 'exercise': return '운동';
      case 'study': return '학습';
      case 'work': return '업무';
      case 'hobby': return '취미';
      default: return '기타';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.activityItem,
        activity.is_completed && styles.completedActivity
      ]} 
      onPress={onPress}
    >
      <View style={styles.activityHeader}>
        <View style={styles.activityInfo}>
          <Text style={[
            styles.activityTitle,
            activity.is_completed && styles.completedText
          ]}>
            {activity.title}
          </Text>
          <View style={[
            styles.typeBadge,
            { backgroundColor: getActivityTypeColor(activity.activity_type) }
          ]}>
            <Text style={styles.typeText}>
              {getActivityTypeText(activity.activity_type)}
            </Text>
          </View>
        </View>
        
        {activity.is_completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>완료</Text>
          </View>
        )}
      </View>
      
      <Text style={[
        styles.activityDescription,
        activity.is_completed && styles.completedText
      ]}>
        {activity.description}
      </Text>
      
      <View style={styles.activityMeta}>
        <Text style={styles.weekDayText}>
          {activity.week}주차 • {activity.day}일차
        </Text>
        {activity.completed_at && (
          <Text style={styles.completedDateText}>
            완료: {new Date(activity.completed_at).toLocaleDateString('ko-KR')}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const ActivityTracker: React.FC<ActivityTrackerProps> = ({ goalId, onActivityPress }) => {
  const { data: activities, isLoading, error, refetch } = useActivities(goalId);
  const { showToast } = useUIActions();

  const handleActivityPress = (activity: Activity) => {
    if (onActivityPress) {
      onActivityPress(activity);
    }
  };

  const handleRetry = () => {
    refetch();
    showToast('활동 목록을 다시 불러오는 중...', 'info');
  };

  const completedActivities = activities?.filter(a => a.is_completed) || [];
  const pendingActivities = activities?.filter(a => !a.is_completed) || [];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>활동을 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error.message || '활동 목록을 불러올 수 없습니다.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>활동이 없습니다</Text>
        <Text style={styles.emptyDescription}>
          이 목표에 대한 활동이 아직 생성되지 않았습니다.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 진행 중인 활동 */}
      {pendingActivities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>진행 중인 활동</Text>
          <FlatList
            data={pendingActivities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ActivityItem 
                activity={item} 
                onPress={() => handleActivityPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* 완료된 활동 */}
      {completedActivities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>완료된 활동</Text>
          <Text style={styles.completedCount}>
            {completedActivities.length}개 완료
          </Text>
          <FlatList
            data={completedActivities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ActivityItem 
                activity={item} 
                onPress={() => handleActivityPress(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  completedCount: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  activityItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedActivity: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  completedText: {
    color: '#7f8c8d',
    textDecorationLine: 'line-through',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  activityDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  completedDateText: {
    fontSize: 12,
    color: '#27ae60',
  },
});
