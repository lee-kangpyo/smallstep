import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useGoalStore } from '../stores';

export default function IndexScreen() {
  const router = useRouter();
  const { goals, loadGoals, isLoading } = useGoalStore();
  const isMounted = useRef(false);
  const hasNavigated = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    loadGoals();
  }, [loadGoals]);

  useEffect(() => {
    if (!isMounted.current || isLoading || hasNavigated.current) return;

    const timer = setTimeout(() => {
      hasNavigated.current = true;
      if (goals.length > 0) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [goals, isLoading, router]);

  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>로딩 중...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});
