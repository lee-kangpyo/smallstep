import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Goal } from "../types/goals";
import Feather from "@expo/vector-icons/Feather";

interface GoalCardProps {
  goal: Goal;
  onPress: (id: string, isNextAction?: boolean) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onPress }) => {
  const progressPercent = Math.round((goal.currentStep / goal.totalSteps) * 100);
  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = goal.nextActionDate === todayStr;

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
      activeOpacity={0.7}
      onPress={() => onPress(goal.id)}
    >
      <View className="flex flex-row justify-between items-start mb-3">
        <View className="flex flex-row space-x-2">
          <View className="px-2.5 py-1 bg-indigo-50 rounded-lg">
            <Text className="text-indigo-600 text-[11px] font-bold uppercase tracking-wider">
              {goal.category}
            </Text>
          </View>
          {isToday && (
            <View className="px-2.5 py-1 bg-red-50 rounded-lg">
              <Text className="text-red-500 text-[11px] font-bold uppercase tracking-wider">
                오늘 예정
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity>
          <Feather name="chevron-right" size={20} color="#D1D5DB" />
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-1">{goal.title}</Text>

      <View className="flex flex-row items-center mb-4">
        <Feather name="calendar" size={12} color="#9CA3AF" />
        <Text className="text-xs text-gray-400 ml-1.5">
          다음 일정: {goal.nextActionDate}
        </Text>
      </View>

      <TouchableOpacity
        className="bg-gray-50 rounded-xl p-3 flex flex-row items-center"
        activeOpacity={0.7}
        onPress={(e) => {
          onPress(goal.id, true);
        }}
      >
        <View className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm mr-3">
          <Feather
            name="play"
            size={14}
            color={isToday ? "#4F46E5" : "#D1D5DB"}
            fill={isToday ? "#4F46E5" : "transparent"}
          />
        </View>
        <View className="flex-1">
          <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
            Next Step
          </Text>
          <Text className="text-sm text-gray-700 font-semibold" numberOfLines={1}>
            {goal.nextAction}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="mt-4 flex flex-row items-center">
        <View className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <View
            className="bg-indigo-500 h-full rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
        <Text className="ml-3 text-[11px] font-bold text-indigo-600">
          {progressPercent}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GoalCard;
