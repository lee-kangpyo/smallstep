import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// QueryClient 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 기본 설정
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 기본 설정
      retry: 1,
      retryDelay: 1000,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 DevTools 표시 */}
      {__DEV__ && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
