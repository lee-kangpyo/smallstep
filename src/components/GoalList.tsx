import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useGoals } from '../hooks/useQueries';
import { useUIActions } from '../hooks/useAppState';
import { Goal } from '../types/api';

interface GoalListProps {
  userId: number;
  onGoalPress?: (goal: Goal) => void;
}

interface GoalItemProps {
  goal: Goal;
  onPress: () => void;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal, onPress }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#27ae60';
    if (progress >= 50) return '#f39c12';
    return '#e74c3c';
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '진행 중';
      case 'completed': return '완료';
      case 'paused': return '일시정지';
      default: return '대기';
    }
  };

  return (
    <TouchableOpacity style={styles.goalItem} onPress={onPress}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>{goal.title}</Text>
        <Text style={[styles.goalStatus, { color: goal.status === 'active' ? '#27ae60' : '#7f8c8d' }]}>
          {getStatusText(goal.status)}
        </Text>
      </View>
      
      {goal.description && (
        <Text style={styles.goalDescription} numberOfLines={2}>
          {goal.description}
        </Text>
      )}
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${goal.progress}%`,
                backgroundColor: getProgressColor(goal.progress)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{goal.progress}%</Text>
      </View>
      
      {goal.category && (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{goal.category}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const GoalList: React.FC<GoalListProps> = ({ userId, onGoalPress }) => {
  const { data: goals, isLoading, error, refetch } = useGoals(userId);
  const { showToast } = useUIActions();

  const handleGoalPress = (goal: Goal) => {
    if (onGoalPress) {
      onGoalPress(goal);
    }
  };

  const handleRetry = () => {
    refetch();
    showToast('목표 목록을 다시 불러오는 중...', 'info');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>목표를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error.message || '목표 목록을 불러올 수 없습니다.'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>목표가 없습니다</Text>
        <Text style={styles.emptyDescription}>
          새로운 목표를 만들어보세요!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={goals}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <GoalItem 
          goal={item} 
          onPress={() => handleGoalPress(item)}
        />
      )}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
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
  listContainer: {
    padding: 16,
  },
  goalItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  goalStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    minWidth: 40,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#3498db',
    backgroundColor: '#ebf3fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
