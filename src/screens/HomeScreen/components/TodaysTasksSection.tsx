import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Goal } from "../../../types/goals";
import Feather from "@expo/vector-icons/Feather";

interface TodaysTasksSectionProps {
  tasks: Goal[];
  onExecute: (id: string) => void;
}

export const TodaysTasksSection: React.FC<TodaysTasksSectionProps> = ({
  tasks,
  onExecute,
}) => {
  return (
    <View className="mb-8">
      {/* 섹션 헤더 */}
      <View className="flex flex-row items-center mb-4">
        <Feather name="clock" size={18} color="#EF4444" />
        <Text className="text-lg font-bold text-gray-800 ml-2">
          오늘 꼭 해야 할 일
        </Text>
      </View>

      {/* 보라색 카드 */}
      <View className="bg-indigo-600 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <View className="relative z-10">
          {tasks.map((goal, idx) => (
            <View
              key={goal.id}
              className={`${
                idx !== 0 ? "mt-4 pt-4 border-t border-indigo-400/30" : ""
              } flex flex-row justify-between items-center`}
            >
              <View className="flex-1 mr-4">
                <Text className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                  {goal.title}
                </Text>
                <Text className="text-base font-bold leading-tight text-white">
                  {goal.nextAction}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onExecute(goal.id)}
                className="bg-white text-indigo-600 px-4 py-2 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-xs font-bold text-indigo-600">
                  실행하기
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {/* 배경 장식 */}
        <View className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
      </View>
    </View>
  );
};
