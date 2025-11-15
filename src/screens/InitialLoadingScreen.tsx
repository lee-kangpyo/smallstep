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

type InitialLoadingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "InitialLoading"
>;

export const InitialLoadingScreen: React.FC = () => {
  const navigation = useNavigation<InitialLoadingScreenNavigationProp>();
  const { data, isLoading, error, refetch, isError } = useHealthCheck();

  // 헬스체크 성공 시 적절한 화면으로 이동
  useEffect(() => {
    if (data && !isLoading) {
      // 헬스체크 성공
      // TODO: 첫 실행 여부 확인 후 온보딩 또는 메인 화면으로 이동
      // 일단 온보딩 화면으로 이동
      navigation.replace("Onboarding");
    }
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


