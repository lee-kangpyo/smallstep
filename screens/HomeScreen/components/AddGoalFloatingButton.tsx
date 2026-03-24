import React from "react";
import { TouchableOpacity, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const AddGoalFloatingButton: React.FC = () => {
  const handlePress = () => {
    Alert.alert("새로운 목표를 추가합니다!");
  };

  return (
    <TouchableOpacity
      className="absolute bottom-8 right-6 w-14 h-14 rounded-2xl items-center justify-center z-50"
      style={{
        backgroundColor: "#4F46E5",
        shadowColor: "#4F46E5",
        shadowOpacity: 0.35,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <Feather name="plus" size={26} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

export default AddGoalFloatingButton;
