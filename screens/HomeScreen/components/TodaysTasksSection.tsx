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
  const primeTask = tasks[0];
  const remainingCount = tasks.length - 1;

  return (
    <View className="mb-8">
      {/* Section label */}
      <Text className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-4 ml-1">
        🔥 지금 할 일
      </Text>

      {/* Mission Card - floating feel */}
      <View
        className="rounded-3xl overflow-hidden"
        style={{
          backgroundColor: "#4F46E5",
          shadowColor: "#4F46E5",
          shadowOpacity: 0.25,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 8,
        }}
      >
        <View className="px-6 pt-7 pb-3">
          <View className="flex-row items-center mb-5">
            <View className="bg-white/15 px-3 py-1 rounded-full">
              <Text className="text-indigo-100 text-[10px] font-black uppercase tracking-widest">
                {primeTask.category || "QUEST"}
              </Text>
            </View>
          </View>

          <Text className="text-indigo-200 text-xs font-semibold mb-1.5">
            {primeTask.title}
          </Text>
          <Text className="text-white text-xl font-black leading-snug" numberOfLines={2}>
            {primeTask.nextAction}
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          onPress={() => onExecute(primeTask.id)}
          activeOpacity={0.9}
          className="mx-5 mb-5 mt-3 bg-white rounded-2xl py-4 flex-row items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text className="text-indigo-600 text-base font-black mr-2">실행하기</Text>
          <Feather name="arrow-right" size={16} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* Remaining hint */}
      {remainingCount > 0 && (
        <View className="flex-row items-center justify-center mt-3">
          <Text className="text-slate-400 text-[11px] font-semibold">
            +{remainingCount}개의 할 일이 대기 중
          </Text>
        </View>
      )}
    </View>
  );
};
