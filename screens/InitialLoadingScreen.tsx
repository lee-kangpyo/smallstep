import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useHealthCheck } from "../hooks/useQueries";
import { Button } from "../components/Button";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getGoals, getActiveGoalId, getUserInfo } from "../services/storage/goalStorage";
import { storage } from "../services/storage/storageAdapter";

type InitialLoadingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "InitialLoading"
>;

export const InitialLoadingScreen: React.FC = () => {
  const navigation = useNavigation<InitialLoadingScreenNavigationProp>();
  const { data, isLoading, error, refetch, isError } = useHealthCheck();

  // Storage 데이터 확인 및 로그 출력
  useEffect(() => {
    const checkAsyncStorage = async () => {
      try {
        console.log('=== Storage 데이터 확인 시작 ===');
        
        // 모든 키 조회
        const allKeys = await storage.getAllKeys();
        console.log('🔑 Storage에 저장된 모든 키:', allKeys);
        
        // SmallStep 관련 키만 필터링
        const smallstepKeys = allKeys.filter(key => key.includes('smallstep'));
        console.log('📦 SmallStep 관련 키:', smallstepKeys);
        
        // 각 키의 값 확인
        for (const key of smallstepKeys) {
          const value = await storage.getItem(key);
          try {
            const parsed = value ? JSON.parse(value) : null;
            console.log(`📝 ${key}:`, parsed);
          } catch (e) {
            console.log(`📝 ${key}:`, value);
          }
        }
        
        // 목표 목록 조회
        const goals = await getGoals();
        console.log('📋 저장된 목표 개수:', goals.length);
        if (goals.length > 0) {
          console.log('📋 목표 목록:', JSON.stringify(goals, null, 2));
        } else {
          console.log('📋 저장된 목표가 없습니다.');
        }
        
        // 활성 목표 ID 조회
        const activeGoalId = await getActiveGoalId();
        console.log('🎯 활성 목표 ID:', activeGoalId || '없음');
        
        // 사용자 정보 조회
        const userInfo = await getUserInfo();
        console.log('👤 사용자 정보:', JSON.stringify(userInfo, null, 2));
        
        console.log('=== Storage 데이터 확인 완료 ===');
      } catch (error) {
        console.error('❌ Storage 데이터 확인 실패:', error);
      }
    };

    checkAsyncStorage();
  }, []);

  // 헬스체크 성공 시 적절한 화면으로 이동
  useEffect(() => {
    const navigateToAppropriateScreen = async () => {
      if (data && !isLoading) {
        // 헬스체크 성공
        // 저장된 목표가 있으면 메인 화면으로, 없으면 온보딩으로 이동
        const goals = await getGoals();
        if (goals.length > 0) {
          // 목표가 있으면 메인 화면으로 이동 (게스트든 회원이든)
          navigation.replace("Main");
        } else {
          // 목표가 없으면 온보딩 화면으로 이동
          navigation.replace("Onboarding");
        }
      }
    };

    navigateToAppropriateScreen();
  }, [data, isLoading, navigation]);

  // 에러 발생 시 재시도 버튼 표시
  const handleRetry = () => {
    refetch();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* 로고 또는 앱 이름 */}
        <View style={styles.logoSection}>
          <Text style={styles.appName}>SmallStep</Text>
          <Text style={styles.tagline}>작은 걸음으로 큰 목표 달성</Text>
        </View>

        {/* 로딩 상태 */}
        {isLoading && (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color={colors.deepMint} />
            <Text style={styles.loadingText}>서버 연결 중...</Text>
          </View>
        )}

        {/* 에러 상태 */}
        {isError && (
          <View style={styles.errorSection}>
            <Text style={styles.errorTitle}>연결 실패</Text>
            <Text style={styles.errorMessage}>
              {error instanceof Error
                ? error.message
                : "서버에 연결할 수 없습니다."}
            </Text>
            <Button
              title="다시 시도"
              onPress={handleRetry}
              variant="primary"
              style={styles.retryButton}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 60,
  },
  appName: {
    ...typography.h1,
    color: colors.deepMint,
    marginBottom: 8,
  },
  tagline: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
  },
  loadingSection: {
    alignItems: "center",
  },
  loadingText: {
    ...typography.body,
    color: colors.primaryText,
    marginTop: 20,
  },
  errorSection: {
    alignItems: "center",
    width: "100%",
  },
  errorTitle: {
    ...typography.h3,
    color: colors.error,
    marginBottom: 12,
  },
  errorMessage: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    width: "100%",
   },
});


