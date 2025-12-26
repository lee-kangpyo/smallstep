import { API_BASE_URL, ENVIRONMENT, DEBUG } from '@env';


// 환경 변수 설정
interface Environment {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'production' | 'staging';
  DEBUG: boolean;
}

// 환경 변수 읽어오기 (로컬 .env + EAS Build 환경 변수)
const getEnvironmentFromEnv = (): Environment => {
  // .env 파일에서 환경 변수 읽기
  // EAS Build 시에는 빌드 환경 변수가 주입됨
  
  console.log('[env.ts] @env에서 읽은 값:');
  console.log('  API_BASE_URL:', API_BASE_URL);
  console.log('  ENVIRONMENT:', ENVIRONMENT);
  console.log('  DEBUG:', DEBUG);
  
  const result = {
    API_BASE_URL: API_BASE_URL!,
    ENVIRONMENT: (ENVIRONMENT as 'development' | 'production' | 'staging') || 'development',
    DEBUG: DEBUG === 'true' || __DEV__,
  };
  
  console.log('[env.ts] 최종 반환값 API_BASE_URL:', result.API_BASE_URL);
  
  return result;
};

export const env = getEnvironmentFromEnv();

// 환경별 설정 내보내기
export const config = {
  api: {
    baseURL: env.API_BASE_URL,
    timeout: 10000,
  },
  app: {
    environment: env.ENVIRONMENT,
    debug: env.DEBUG,
  },
};

// 환경 정보 유틸리티
export const getEnvironmentInfo = () => ({
  environment: env.ENVIRONMENT,
  apiBaseUrl: env.API_BASE_URL,
  debug: env.DEBUG,
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
});

// 환경 설정 로깅 (개발 환경에서만)
export const logEnvironmentInfo = () => {
  if (__DEV__) {
    console.log('🌍 Environment Info:', getEnvironmentInfo());
    console.log('⚙️ Config:', config);
    console.log('🔧 Process Env:', {
      API_BASE_URL: process.env.API_BASE_URL,
      ENVIRONMENT: process.env.ENVIRONMENT,
      DEBUG: process.env.DEBUG,
    });
  }
};

// API 연결 상태 확인
export const checkApiConnection = async () => {
  try {
    const response = await fetch(`${env.API_BASE_URL}/api/smallstep/health`);
    const data = await response.json();
    
    if (__DEV__) {
      console.log('✅ API Connection Status:', data);
    }
    
    return {
      connected: true,
      status: data.status,
      service: data.service,
    };
  } catch (error) {
    if (__DEV__) {
      console.error('❌ API Connection Failed:', error);
    }
    
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
