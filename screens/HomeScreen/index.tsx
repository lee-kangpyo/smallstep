import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import GoalCard from "../../components/GoalCard";
import AddGoalFloatingButton from "./components/AddGoalFloatingButton";
import { TodaysTasksSection } from "./components/TodaysTasksSection";
import { useHomeViewModel } from "./models/viewModel";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const {
    headerData,
    todaysTasks,
    plannerGoals,
  } = useHomeViewModel();

  const handleGoalPress = (id: string, isNextAction?: boolean) => {
    Alert.alert("핸들 골프레스", `ID: ${id}, Next Action: ${isNextAction}`);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#FAFAFA" }} edges={["top"]}>
      <Header user={headerData} />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 120 }}
      >
        {/* Focus: 오늘 할 일 */}
        {todaysTasks.length > 0 ? (
          <TodaysTasksSection
            tasks={todaysTasks}
            onExecute={(id) => handleGoalPress(id, true)}
          />
        ) : (
          <View className="items-center py-10 mb-6">
            <Text className="text-4xl mb-3">✨</Text>
            <Text className="text-slate-800 text-lg font-bold">모든 할 일 완료!</Text>
            <Text className="text-slate-400 text-sm font-medium mt-1">
              오늘도 대단해요. 새 목표를 추가해보세요.
            </Text>
          </View>
        )}

        {/* 전체 목표 */}
        {plannerGoals.length > 0 && (
          <>
            <Text className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 ml-1">
              📋 전체 목표
            </Text>

            {plannerGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onPress={handleGoalPress} />
            ))}
          </>
        )}
      </ScrollView>

      <AddGoalFloatingButton />
    </SafeAreaView>
  );
};
