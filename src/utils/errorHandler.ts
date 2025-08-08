import { AppError, classifyError, ErrorCode, ERROR_MESSAGES } from '../types/errors';

// 에러 처리 유틸리티

/**
 * 에러를 로깅합니다 (개발 환경에서만)
 */
export const logError = (error: AppError, context?: string) => {
  if (__DEV__) {
    console.error(`🚨 Error${context ? ` (${context})` : ''}:`, {
      code: error.code,
      message: error.message,
      userMessage: error.userMessage,
      details: error.details,
    });
  }
};

/**
 * 에러가 재시도 가능한지 확인합니다
 */
export const isRetryableError = (error: AppError): boolean => {
  const retryableCodes = [
    ErrorCode.NETWORK_ERROR,
    ErrorCode.TIMEOUT_ERROR,
    ErrorCode.SERVER_ERROR,
    ErrorCode.API_ERROR,
  ];
  
  return retryableCodes.includes(error.code as ErrorCode);
};

/**
 * 에러가 인증 관련인지 확인합니다
 */
export const isAuthError = (error: AppError): boolean => {
  const authCodes = [
    ErrorCode.UNAUTHORIZED,
    ErrorCode.FORBIDDEN,
  ];
  
  return authCodes.includes(error.code as ErrorCode);
};

/**
 * 에러 메시지를 사용자에게 표시할 수 있는 형태로 변환합니다
 */
export const getUserFriendlyError = (error: AppError) => {
  const errorInfo = ERROR_MESSAGES[error.code as ErrorCode];
  
  return {
    title: errorInfo?.title || '오류',
    message: error.userMessage,
    action: errorInfo?.action || '다시 시도',
    retryable: isRetryableError(error),
    requiresAuth: isAuthError(error),
  };
};

/**
 * API 에러를 처리하고 사용자 친화적 메시지로 변환합니다
 */
export const handleApiError = (error: any, endpoint?: string): AppError => {
  const appError = classifyError(error);
  
  // 추가 컨텍스트 정보 추가
  if (endpoint) {
    appError.details = {
      ...appError.details,
      endpoint,
      timestamp: new Date().toISOString(),
    };
  }
  
  // 에러 로깅
  logError(appError, endpoint);
  
  return appError;
};

/**
 * 재시도 로직을 포함한 API 호출 래퍼
 */
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: AppError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      const appError = classifyError(error);
      lastError = appError;
      
      // 재시도 가능한 에러가 아니면 즉시 실패
      if (!isRetryableError(appError)) {
        throw appError;
      }
      
      // 마지막 시도가 아니면 대기 후 재시도
      if (attempt < maxRetries) {
        logError(appError, `Retry attempt ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  // 모든 재시도 실패
  throw lastError!;
};

/**
 * 오프라인 상태 확인
 */
export const checkOfflineStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      mode: 'no-cors',
    });
    return false; // 온라인
  } catch {
    return true; // 오프라인
  }
};

/**
 * 네트워크 상태에 따른 에러 처리
 */
export const handleNetworkError = async (error: any): Promise<AppError> => {
  const isOffline = await checkOfflineStatus();
  
  if (isOffline) {
    return {
      code: ErrorCode.OFFLINE_ERROR,
      message: 'Device is offline',
      userMessage: ERROR_MESSAGES[ErrorCode.OFFLINE_ERROR].message,
      details: { isOffline: true },
    };
  }
  
  return classifyError(error);
};
