import React from 'react';
import { StatusBar } from 'expo-status-bar';
import './global.css'; // NativeWind 전역 스타일
import './src/config/calendarLocale'; // 한글 로케일 설정 초기화
import { QueryProvider } from './src/providers/QueryProvider';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <QueryProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </QueryProvider>
  );
}
