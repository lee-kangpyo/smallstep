import React from "react";
import {
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityDetailModal } from "../../components/ActivityDetailModal";
import { useGoalsViewModel } from "./models/viewModel";
import { useActiveGoals } from "./models/useActiveGoals";
import { WeekCalendar } from "./components/WeekCalendar";
import { ActivityList } from "./components/ActivityList"; 
import { styles } from "./styles";

interface GoalsScreenProps {
  navigation: any;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  //  ViewModel
  const {
    selectedDate,
    activityModalVisible,
    selectedActivity,
    weekData,
    selectedDateActivities,
    handleDateSelect,
    handleActivityPress,
    handleActivityComplete,
    handleActivityModalClose,
    isActivityCompleted,
    getDateTitle,
  } = useGoalsViewModel();

  // 진행 중인 목표 리스트  ViewModel
//   const { activeGoals, handleGoalPress, handleGoalEdit, handleGoalDelete } = useActiveGoals();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 주간 캘린더 */}
        <WeekCalendar
          weekData={weekData}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {/* 선택된 날짜의 활동 */}
        <ActivityList
          activities={selectedDateActivities}
          selectedDate={selectedDate}
          dateTitle={getDateTitle(selectedDate)}
          isActivityCompleted={isActivityCompleted}
          onActivityPress={handleActivityPress}
        />

        {/* 진행 중인 목표 리스트 
        <ActiveGoalsList
          activeGoals={activeGoals}
          onGoalPress={handleGoalPress}
          onGoalEdit={handleGoalEdit}
          onGoalDelete={handleGoalDelete}
        />
         */}
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

