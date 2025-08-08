import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabParamList, RootStackParamList } from '../types/navigation';
import { HomeScreen } from '../components/example/HomeScreen';
import { GoalList } from '../components/GoalList';
import { ActivityTracker } from '../components/ActivityTracker';
import { UserProfile } from '../components/example/UserProfile';

const Tab = createBottomTabNavigator<MainTabParamList>();

// ===== 탭 아이콘 컴포넌트 =====
const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return focused ? '🏠' : '🏠';
      case 'Goals':
        return focused ? '🎯' : '🎯';
      case 'Activities':
        return focused ? '📋' : '📋';
      case 'Profile':
        return focused ? '👤' : '👤';
      default:
        return '📱';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {getIcon()}
      </Text>
    </View>
  );
};

// ===== 홈 스크린 래퍼 =====
const HomeScreenWrapper: React.FC<{ route: any; navigation: any }> = ({ route }) => {
  const userId = route.params?.userId || 1;
  return <HomeScreen userId={userId} />;
};

// ===== 목표 스크린 래퍼 =====
const GoalsScreenWrapper: React.FC<{ route: any; navigation: any }> = ({ route }) => {
  const navigation = useNavigation<any>();
  const userId = route.params?.userId || 1;
  
  const handleGoalPress = (goal: any) => {
    navigation.navigate('GoalDetail' as keyof RootStackParamList, { 
      goalId: goal.id, 
      userId: userId 
    });
  };

  return (
    <View style={styles.screenContainer}>
      <GoalList userId={userId} onGoalPress={handleGoalPress} />
    </View>
  );
};

// ===== 활동 스크린 래퍼 =====
const ActivitiesScreenWrapper: React.FC<{ route: any; navigation: any }> = ({ route }) => {
  const navigation = useNavigation<any>();
  const userId = route.params?.userId || 1;
  
  const handleActivityPress = (activity: any) => {
    navigation.navigate('ActivityDetail' as keyof RootStackParamList, { 
      activityId: activity.id, 
      goalId: activity.goal_id 
    });
  };

  return (
    <View style={styles.screenContainer}>
      <ActivityTracker 
        goalId={route.params?.goalId || 1} // 기본값 설정
        onActivityPress={handleActivityPress}
      />
    </View>
  );
};

// ===== 프로필 스크린 래퍼 =====
const ProfileScreenWrapper: React.FC<{ route: any; navigation: any }> = ({ route }) => {
  const userId = route.params?.userId || 1;
  return <UserProfile userId={userId} />;
};

export const MainTabNavigator: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabIcon name={route.name} focused={focused} />
          ),
          tabBarActiveTintColor: '#3498db',
          tabBarInactiveTintColor: '#7f8c8d',
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreenWrapper}
          options={{ title: '홈' }}
        />
        <Tab.Screen 
          name="Goals" 
          component={GoalsScreenWrapper}
          options={{ title: '목표' }}
        />
        <Tab.Screen 
          name="Activities" 
          component={ActivitiesScreenWrapper}
          options={{ title: '활동' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreenWrapper}
          options={{ title: '프로필' }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    opacity: 0.7,
  },
  iconFocused: {
    opacity: 1,
  },
});
