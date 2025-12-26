import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoalCard } from "../components/GoalCard";
import { GoalModal } from "../components/GoalModal";
import { Button } from "../components/Button";
import { Goal } from "../types";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import { useGoalStore } from "../stores";
import { generateWeekData } from "../utils/dateUtils";
import { getTodayActivitiesFromGoals, getActivitiesForDate } from "../utils/scheduleUtils";
import { CalendarDay } from "../utils/dateUtils";

interface GoalsScreenProps {
  navigation: any;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ navigation }) => {
  const {
    goals,
    isLoading,
    loadGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    getActiveGoals,
  } = useGoalStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 목표 로드
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  // 주간 캘린더 데이터
  const weekData = generateWeekData(new Date());
  const activeGoals = getActiveGoals();
  
  // 선택된 날짜의 활동 가져오기
  const selectedDateActivities = getTodayActivitiesFromGoals(activeGoals, selectedDate);
  
  // 디버깅: 선택된 날짜와 목표 정보 로그
  useEffect(() => {
    console.log('[GoalsScreen] 선택된 날짜:', selectedDate.toISOString().split('T')[0]);
    console.log('[GoalsScreen] 활성 목표 개수:', activeGoals.length);
    activeGoals.forEach(goal => {
      console.log('[GoalsScreen] 목표:', goal.title, {
        startDate: goal.startDate,
        weeklyPattern: goal.weeklyPattern,
        scheduleLength: goal.roadmap?.schedule?.length || 0,
        scheduleSample: goal.roadmap?.schedule?.slice(0, 5).map(s => ({ week: s.week, day: s.day }))
      });
    });
    console.log('[GoalsScreen] 선택된 날짜 활동 개수:', selectedDateActivities.length);
  }, [selectedDate, activeGoals, selectedDateActivities.length]);

  const handleGoalPress = (goal: Goal) => {
    // 홈 화면으로 이동하면서 선택된 목표 전달
    navigation.navigate("Home", { selectedGoalId: goal.id });
  };

  const handleGoalEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setModalVisible(true);
  };

  const handleGoalDelete = (goal: Goal) => {
    Alert.alert("목표 삭제", `${goal.title} 목표를 삭제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteGoal(goal.id);
        },
      },
    ]);
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setModalVisible(true);
  };

  const handleBackToHome = () => {
    navigation.navigate("Home");
  };

  const handleSaveGoal = async (goalData: Partial<Goal>) => {
    if (editingGoal) {
      // 기존 목표 수정
      await updateGoal(editingGoal.id, goalData);
    } else {
      // 새 목표 추가
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: goalData.title!,
        description: goalData.description || "",
        priority: goalData.priority || 3,
        status: goalData.status || "active",
        roadmap: {
          roadmap: [],
          schedule: [],
        },
        progress: {
          currentPhase: 1,
          completedPhases: [],
          completedScheduleItems: [],
          totalProgress: 0,
          consecutiveDays: 0,
        },
        createdAt: new Date(),
        startDate: new Date().toISOString().split('T')[0],
        weeklyPattern: {
          frequency: 3,
          selectedDays: [1, 3, 5],
        },
      };
      await addGoal(newGoal);
    }
    setModalVisible(false);
    setEditingGoal(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingGoal(null);
  };

  const renderWeekCalendar = () => {
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    
    // 주간 캘린더의 첫 번째 날(일요일)로부터 년도와 월 추출
    const firstDay = weekData.days[0]?.date;
    const year = firstDay?.getFullYear();
    const month = firstDay ? firstDay.getMonth() + 1 : new Date().getMonth() + 1;
    const calendarTitle = year && month ? `${year}년 ${month}월` : '이번 주';

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>{calendarTitle}</Text>
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <View key={day} style={styles.weekDayHeader}>
              <Text
                style={[
                  styles.weekDayText,
                  (index === 0 || index === 6) && styles.weekendText,
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.weekDays}>
          {weekData.days.map((day: CalendarDay, index: number) => {
            const isWeekend = index === 0 || index === 6;
            const isSelected = selectedDate.toDateString() === day.date.toDateString();
            return (
              <TouchableOpacity
                key={day.date.toISOString()}
                style={[
                  styles.dayContainer,
                  day.isToday && styles.todayContainer,
                  isSelected && !day.isToday && styles.selectedDay,
                ]}
                onPress={() => setSelectedDate(day.date)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dayText,
                    day.isToday && styles.todayText,
                    isSelected && !day.isToday && styles.selectedDayText,
                    isWeekend && !day.isToday && !isSelected && styles.weekendText,
                  ]}
                >
                  {day.day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderDateActivities = () => {
    // 선택된 날짜 정보 포맷팅
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const selectedDayName = dayNames[selectedDate.getDay()];
    const selectedDayNumber = selectedDate.getDate();
    const dateTitle = `${selectedDayNumber}일 ${selectedDayName}요일`;

    if (selectedDateActivities.length === 0) {
      return (
        <View style={styles.todayActivitiesContainer}>
          <Text style={styles.sectionTitle}>{dateTitle}</Text>
          <View style={styles.emptyActivities}>
            <Text style={styles.emptyActivitiesText}>
              예정된 활동이 없습니다
            </Text>
          </View>
        </View>
      );
    }

    // 요일 이름 매핑 (1=월, 7=일)
    const dayNameMap = ['', '월', '화', '수', '목', '금', '토', '일'];

    return (
      <View style={styles.todayActivitiesContainer}>
        <Text style={styles.sectionTitle}>{dateTitle}</Text>
        {selectedDateActivities.map((activity, index) => (
          <View key={`${activity.goalId}-${activity.week}-${activity.day}-${index}`} style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityGoalTitle}>{activity.goalTitle}</Text>
              <Text style={styles.activityWeekDay}>
                {activity.week}주차, {dayNameMap[activity.day]}요일
              </Text>
            </View>
            <Text style={styles.activityTitle}>{activity.title}</Text>
            {activity.description && (
              <Text style={styles.activityDescription} numberOfLines={2}>
                {activity.description}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToHome}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.title}>목표</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddGoal}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={24} color={colors.deepMint} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 주간 캘린더 */}
        {renderWeekCalendar()}

        {/* 선택된 날짜의 활동 */}
        {renderDateActivities()}

        {/* 진행 중인 목표 리스트 */}
        <View style={styles.goalsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>진행 중인 목표</Text>
            <Text style={styles.goalCount}>{activeGoals.length}개</Text>
          </View>

          {activeGoals.length === 0 ? (
            <View style={styles.emptyGoals}>
              <Ionicons
                name="flag-outline"
                size={48}
                color={colors.secondaryText}
              />
              <Text style={styles.emptyGoalsText}>목표가 없습니다</Text>
              <Text style={styles.emptyGoalsDescription}>
                첫 번째 목표를 추가해보세요!
              </Text>
            </View>
          ) : (
            activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onPress={() => handleGoalPress(goal)}
                onEdit={() => handleGoalEdit(goal)}
                onDelete={() => handleGoalDelete(goal)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* 목표 편집 모달 */}
      <GoalModal
        visible={modalVisible}
        goal={editingGoal}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightBlue,
  },
  backButton: {
    padding: 4,
  },
  title: {
    ...typography.h2,
    color: colors.primaryText,
    fontWeight: "600",
  },
  addButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  calendarContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  weekHeader: {
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 8,
  },
  weekDayHeader: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  weekendText: {
    color: colors.deepMint,
  },
  weekDays: {
    flexDirection: "row",
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  todayContainer: {
    backgroundColor: colors.deepMint,
  },
  selectedDay: {
    backgroundColor: colors.lightBlue,
    borderWidth: 2,
    borderColor: colors.deepMint,
  },
  selectedDayText: {
    color: colors.deepMint,
    fontWeight: "600",
  },
  dayText: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "500",
  },
  todayText: {
    color: colors.white,
    fontWeight: "600",
  },
  todayActivitiesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  emptyActivities: {
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyActivitiesText: {
    ...typography.body,
    color: colors.secondaryText,
  },
  activityItem: {
    marginTop: 12,
    padding: 16,
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  activityGoalTitle: {
    ...typography.caption,
    color: colors.deepMint,
    fontWeight: "600",
  },
  activityWeekDay: {
    ...typography.caption,
    color: colors.secondaryText,
    fontWeight: "500",
  },
  activityTitle: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
    marginBottom: 4,
  },
  activityDescription: {
    ...typography.body,
    color: colors.secondaryText,
  },
  goalsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primaryText,
    fontWeight: "600",
  },
  goalCount: {
    ...typography.caption,
    color: colors.secondaryText,
  },
  emptyGoals: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyGoalsText: {
    ...typography.h4,
    color: colors.primaryText,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyGoalsDescription: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
  },
});
