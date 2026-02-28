import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const AddGoalFloatingButton: React.FC = () => {
  const handlePress = () => {
    Alert.alert("새로운 목표를 추가합니다!");
  };

  return (
    <TouchableOpacity
      className="absolute bottom-8 right-6 w-14 h-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg z-50"
      activeOpacity={0.8}
        onPress={handlePress}
    >
      <Feather name="plus" size={32} color="#FFFFFF" strokeWidth={2.5} />
    </TouchableOpacity>
  );
};

export default AddGoalFloatingButton;
