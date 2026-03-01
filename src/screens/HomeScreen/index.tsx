import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import GoalCard from "../../components/GoalCard";
import AddGoalFloatingButton from "./components/AddGoalFloatingButton";
import { TodaysTasksSection } from "./components/TodaysTasksSection";
import { Feather } from "@expo/vector-icons";
import { useHomeViewModel } from "./models/viewModel";

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const {
    headerData,
    todaysTasks,
    plannerGoals,
  } = useHomeViewModel();

  const handleGoalPress = (id: string, isNextAction?: boolean) => {
    Alert.alert('핸들 골프레스', `ID: ${id}, Next Action: ${isNextAction}`);
  };

  return (
    <SafeAreaView className="flex-1 flex-col h-full bg-gray-50">
      <Header user={headerData} />

      <ScrollView
        className="px-6 py-4 pb-32"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
      >
        {/* 오늘 할 일 섹션 */}
        {todaysTasks.length > 0 && (
          <TodaysTasksSection
            tasks={todaysTasks}
            onExecute={(id) => handleGoalPress(id, true)}
          />
        )}

        <View className="flex flex-row justify-between items-center mb-6">
          <View className="flex flex-row items-center">
            <Feather name="calendar" size={18} color="#4F46E5" />
            <Text className="text-lg font-bold text-gray-800 ml-2">
              나의 플래너
            </Text>
          </View>
        </View>

        {plannerGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onPress={handleGoalPress} />
        ))}
      </ScrollView>
      <AddGoalFloatingButton />
    </SafeAreaView>
  );
};
