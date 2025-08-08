import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from 'react-native';
import { RootStackParamList } from '../types/navigation';
import { MainTabNavigator } from './MainTabNavigator';
import { GoalDetailScreen } from '../screens/GoalDetailScreen';
import { ActivityDetailScreen } from '../screens/ActivityDetailScreen';
import { CreateGoalScreen } from '../screens/CreateGoalScreen';
import { CreateActivityScreen } from '../screens/CreateActivityScreen';
import { SettingsScreen } from '../screens/SettingsScreen';


const Stack = createStackNavigator<RootStackParamList>();





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
