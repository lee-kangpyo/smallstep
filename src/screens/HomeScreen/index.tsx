import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ActivityList } from "../GoalsScreen/components/ActivityList";
import { ActivityDetailModal } from "../../components/ActivityDetailModal";
import { WeekProgressSummary } from "./components/WeekProgressSummary";
import { useHomeViewModel } from "./models/viewModel";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";
import { Ionicons } from "@expo/vector-icons";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // ViewModel
  const {
    today,
    todayActivities,
    weekProgressStats,
    activityModalVisible,
    selectedActivity,
    handleActivityPress,
    handleActivityComplete,
    handleActivityModalClose,
    isActivityCompleted,
    getDateTitle,
  } = useHomeViewModel();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.dateTitle}>{getDateTitle(today)}</Text>
          <TouchableOpacity
            style={styles.addGoalButton}
            onPress={() => navigation.navigate("GoalTemplateSelection")}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={24} color={colors.deepMint} />
            <Text style={styles.addGoalText}>목표 추가</Text>
          </TouchableOpacity>
        </View>

        {/* 이번 주 요약 */}
        {weekProgressStats && (
          <WeekProgressSummary
            stats={weekProgressStats}
            onViewAllPress={() => navigation.navigate("Report")}
          />
        )}

        {/* 오늘의 활동 리스트 */}
        <ActivityList
          activities={todayActivities}
          selectedDate={today}
          dateTitle="오늘의 활동"
          isActivityCompleted={isActivityCompleted}
          onActivityPress={handleActivityPress}
        />
      </ScrollView>

      {/* 활동 상세 모달 */}
      <ActivityDetailModal
        visible={activityModalVisible}
        activity={selectedActivity}
        isCompleted={
          selectedActivity
            ? isActivityCompleted(
                `${selectedActivity.goalId}-${selectedActivity.week}-${selectedActivity.day}`
              )
            : false
        }
        onClose={handleActivityModalClose}
        onComplete={handleActivityComplete}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  dateTitle: {
    ...typography.h2,
    color: colors.primaryText,
    fontWeight: "600",
  },
  addGoalButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addGoalText: {
    ...typography.body,
    color: colors.deepMint,
    fontWeight: "600",
  },
});
