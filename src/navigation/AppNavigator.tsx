import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeScreen } from "../screens/HomeScreen";
import { ReportScreen } from "../screens/ReportScreen";
import { TestScreen } from "../screens/TestScreen";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { GoalsScreen } from "../screens/GoalsScreen";
import GoalTemplateSelectionScreen from "../screens/GoalTemplateSelectionScreen";
import { InitialLoadingScreen } from "../screens/InitialLoadingScreen";
import { colors } from "../constants/colors";

// 네비게이션 타입 정의
export type RootStackParamList = {
  InitialLoading: undefined;
  Onboarding: undefined;
  GoalTemplateSelection: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Goals: undefined;
  Report: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// 메인 탭 네비게이터
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.deepMint,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.lightBlue,
          borderTopWidth: 1,
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
          display: "flex", // 강제로 표시
        },
        headerStyle: {
          backgroundColor: colors.white,
        },
        headerTintColor: colors.primaryText,
        headerTitleStyle: {
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "홈",
          tabBarLabel: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          title: "목표",
          tabBarLabel: "목표",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flag" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: "리포트",
          tabBarLabel: "리포트",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={TestScreen}
        options={{
          title: "프로필",
          tabBarLabel: "프로필",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// 루트 스택 네비게이터
export const AppNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="InitialLoading"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen 
            name="InitialLoading" 
            component={InitialLoadingScreen}
          />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen 
            name="GoalTemplateSelection" 
            component={GoalTemplateSelectionScreen}
            options={{
              title: '목표 선택',
              headerShown: true,
            }}
          />
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
