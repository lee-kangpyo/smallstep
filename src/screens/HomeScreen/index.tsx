import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import GoalCard from "../../components/GoalCard";
import AddGoalFloatingButton from "./components/AddGoalFloatingButton";
import { TodaysTasksSection } from "./components/TodaysTasksSection";
import { Feather } from "@expo/vector-icons";

const todayStr = new Date().toISOString().split("T")[0];

const MOCK_GOALS = [
  {
    id: "1",
    title: "하프 마라톤 완주하기",
    totalSteps: 12,
    currentStep: 4,
    nextAction: "인터벌 트레이닝 5km",
    nextActionDate: todayStr,
    category: "운동",
    tasks: [],
  },
  {
    id: "2",
    title: "단편 소설 초고 완성",
    totalSteps: 8,
    currentStep: 2,
    nextAction: "주인공 갈등 요소 설정",
    nextActionDate: todayStr,
    category: "창작",
    tasks: [],
  },
  {
    id: "3",
    title: "기초 포르투갈어 회화",
    totalSteps: 10,
    currentStep: 3,
    nextAction: "식당에서 주문하기 연습",
    nextActionDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    category: "학습",
    tasks: [],
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const user = {
    name: "지민",
    activeGoalCount: MOCK_GOALS.length,
    overallProgress: 42,
  };

  const todaysTasks = MOCK_GOALS.filter((g) => g.nextActionDate === todayStr);

  const handleGoalPress = (id: string, isNextAction?: boolean) => {
    console.log("Goal pressed:", id, "Next action:", isNextAction);
  };

  return (
    <SafeAreaView className="flex-1 flex-col h-full bg-gray-50">
      <Header user={user} />

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

        {MOCK_GOALS.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onPress={handleGoalPress} />
        ))}
      </ScrollView>
      <AddGoalFloatingButton />
    </SafeAreaView>
  );
};
