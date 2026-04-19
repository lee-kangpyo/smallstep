import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserState } from "../types/goals";
import Feather from "@expo/vector-icons/Feather";

interface HeaderProps {
  user: UserState;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <View className="px-6 pt-14 pb-6" style={{ backgroundColor: "#FAFAFA" }}>
      <View className="flex flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
            {user.name}님,{"\n"}오늘도 파이팅 💪
          </Text>
        </View>
        <TouchableOpacity
          className="w-11 h-11 rounded-2xl items-center justify-center ml-4 mt-1"
          style={{ backgroundColor: "#F1F5F9" }}
        >
          <Feather name="bell" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Compact stats row */}
      <View className="flex-row items-center mt-5 gap-4">
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
          <Text className="text-slate-400 text-xs font-semibold">목표</Text>
          <Text className="text-slate-700 text-sm font-black ml-1.5">{user.activeGoalCount}개</Text>
        </View>
        <View className="w-px h-3 bg-slate-200" />
        <View className="flex-row items-center">
          <View className="w-2 h-2 rounded-full bg-violet-500 mr-2" />
          <Text className="text-slate-400 text-xs font-semibold">달성률</Text>
          <Text className="text-slate-700 text-sm font-black ml-1.5">{user.overallProgress}%</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
