import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";
import { Button } from "../../components/Button";
import { useGoalStore } from "../../stores";

export default function ProfileScreen() {
  const { goals, deleteGoal } = useGoalStore();

  const handleClearAllGoals = () => {
    Alert.alert(
      '모든 목표 삭제',
      '정말 모든 목표를 삭제하시겠습니까?\n(테스트용)',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const goal of goals) {
                await deleteGoal(goal.id);
              }
              Alert.alert('삭제 완료', `${goals.length}개의 목표를 삭제했습니다.`);
            } catch (error) {
              Alert.alert('오류', '목표 삭제에 실패했습니다.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필</Text>
      <Text style={styles.subtitle}>현재 목표: {goals.length}개</Text>
      <View style={styles.testBox}>
        <Text style={styles.testText}>테스트용 버튼</Text>
      </View>
      <Button
        title="모든 목표 삭제"
        onPress={handleClearAllGoals}
        variant="outline"
        style={styles.deleteButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: 20,
  },
  subtitle: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 50,
  },
  testBox: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  testText: {
    ...typography.body,
    color: colors.primaryText,
    textAlign: "center",
  },
  deleteButton: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});
