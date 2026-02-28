import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserState } from "../types/goals";
import Feather from "@expo/vector-icons/Feather";

interface HeaderProps {
  user: UserState;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <View className="px-6 pt-12 pb-6 bg-white border-b border-gray-100">
      <View className="flex flex-row justify-between items-start mb-6">
        <View>
          <Text className="text-2xl font-bold text-gray-900 leading-tight">
            반가워요, {user.name}님!
          </Text>
          <Text className="text-gray-500 mt-1 font-medium">
            오늘 {user.activeGoalCount}개의 목표가 기다리고 있어요.
          </Text>
        </View>
        <TouchableOpacity className="p-2 bg-gray-50 rounded-full">
          <Feather name="bell" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View className="space-y-2">
        <View className="flex flex-row justify-between items-end">
          <Text className="text-sm font-semibold text-gray-700">전체 달성률</Text>
          <Text className="text-sm font-bold text-indigo-600">{user.overallProgress}%</Text>
        </View>
        <View className="w-full bg-indigo-50 h-3 rounded-full overflow-hidden">
          <View
            className="bg-indigo-600 h-full rounded-full"
            style={{ width: `${user.overallProgress}%` }}
          />
        </View>
      </View>
    </View>
  );
};

export default Header;
