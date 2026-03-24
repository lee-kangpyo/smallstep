import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Goal } from "../types/goals";
import Feather from "@expo/vector-icons/Feather";

interface GoalCardProps {
  goal: Goal;
  onPress: (id: string, isNextAction?: boolean) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onPress }) => {
  const progressPercent = Math.round(
    (goal.currentStep / goal.totalSteps) * 100
  );

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl px-5 py-4 mb-3"
      activeOpacity={0.7}
      onPress={() => onPress(goal.id)}
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
      }}
    >
      {/* Top row */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-slate-900 text-[15px] font-bold flex-1 mr-3" numberOfLines={1}>
          {goal.title}
        </Text>
        <Feather name="chevron-right" size={16} color="#CBD5E1" />
      </View>

      {/* Next action */}
      <View className="flex-row items-center mb-3">
        <View className="w-5 h-5 rounded-md bg-indigo-50 items-center justify-center mr-2.5">
          <Feather name="zap" size={11} color="#6366F1" />
        </View>
        <Text className="text-slate-500 text-[13px] font-medium flex-1" numberOfLines={1}>
          {goal.nextAction}
        </Text>
      </View>

      {/* Progress bar */}
      <View className="flex-row items-center">
        <View className="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden mr-3">
          <View
            className="h-full rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: progressPercent >= 70 ? "#22C55E" : "#6366F1",
            }}
          />
        </View>
        <Text className="text-[11px] font-bold text-slate-400 w-8 text-right">
          {progressPercent}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GoalCard;
