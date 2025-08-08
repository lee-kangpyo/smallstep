import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { MainTabNavigator } from './MainTabNavigator';


const Stack = createStackNavigator<RootStackParamList>();

// ===== 임시 스크린 컴포넌트들 =====
const GoalDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>목표 상세 화면 (ID: {route.params.goalId})</Text>
    </View>
  );
};

const ActivityDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>활동 상세 화면 (ID: {route.params.activityId})</Text>
    </View>
  );
};

const CreateGoalScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>새 목표 만들기 화면</Text>
    </View>
  );
};

const CreateActivityScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>새 활동 만들기 화면 (Goal ID: {route.params.goalId})</Text>
    </View>
  );
};

const SettingsScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>설정 화면</Text>
    </View>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerBackTitle: '',
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="GoalDetail" 
          component={GoalDetailScreen}
          options={{ title: '목표 상세' }}
        />
        <Stack.Screen 
          name="ActivityDetail" 
          component={ActivityDetailScreen}
          options={{ title: '활동 상세' }}
        />
        <Stack.Screen 
          name="CreateGoal" 
          component={CreateGoalScreen}
          options={{ title: '새 목표 만들기' }}
        />
        <Stack.Screen 
          name="CreateActivity" 
          component={CreateActivityScreen}
          options={{ title: '새 활동 만들기' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: '설정' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
