import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser, useGameData } from '../../hooks/useQueries';
import { useUIActions, useToast } from '../../hooks/useAppState';

interface UserProfileProps {
  userId: number;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // React Query로 서버 상태 관리
  const { data: user, isLoading: userLoading, error: userError } = useUser(userId);
  const { data: gameData, isLoading: gameLoading, error: gameError } = useGameData(userId);
  
  // Zustand로 클라이언트 상태 관리
  const { showToast } = useUIActions();
  const toast = useToast();

  // 로딩 상태
  if (userLoading || gameLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>사용자 정보를 불러오는 중...</Text>
      </View>
    );
  }

  // 에러 상태
  if (userError || gameError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {userError?.message || gameError?.message || '사용자 정보를 불러올 수 없습니다.'}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            // React Query의 refetch 기능 사용
            // 실제로는 useQuery의 refetch 함수를 사용해야 함
            showToast('다시 시도 중...', 'info');
          }}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 사용자 정보 */}
      {user && (
        <View style={styles.userSection}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userLevel}>레벨: {user.level}</Text>
        </View>
      )}

      {/* 게임 데이터 */}
      {gameData && (
        <View style={styles.gameSection}>
          <Text style={styles.gameTitle}>게임 통계</Text>
          <Text style={styles.gameStat}>경험치: {gameData.experience}</Text>
          <Text style={styles.gameStat}>연속 달성: {gameData.current_streak}일</Text>
          <Text style={styles.gameStat}>최고 기록: {gameData.longest_streak}일</Text>
        </View>
      )}

      {/* 토스트 메시지 */}
      {toast && toast.visible && (
        <View style={[styles.toast, styles[`toast${toast.type}`]]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#e74c3c',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  userLevel: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: '600',
  },
  gameSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  gameStat: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
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
