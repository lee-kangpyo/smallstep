// 에러 타입 정의

// 기본 에러 타입
export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  details?: any;
}

// API 에러 타입
export interface ApiError extends AppError {
  status: number;
  endpoint: string;
  method: string;
}

// 네트워크 에러 타입
export interface NetworkError extends AppError {
  isOffline: boolean;
  retryable: boolean;
}

// 인증 에러 타입
export interface AuthError extends AppError {
  requiresLogin: boolean;
}

// 에러 코드 정의
export enum ErrorCode {
  // 네트워크 에러
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  OFFLINE_ERROR = 'OFFLINE_ERROR',
  
  // API 에러
  API_ERROR = 'API_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  
  // 인증 에러
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  
  // 데이터 에러
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  
  // 기타
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// 사용자 친화적 에러 메시지 매핑
export const ERROR_MESSAGES = {
  [ErrorCode.NETWORK_ERROR]: {
    title: '네트워크 오류',
    message: '인터넷 연결을 확인해주세요.',
    action: '다시 시도'
  },
  [ErrorCode.TIMEOUT_ERROR]: {
    title: '시간 초과',
    message: '요청이 시간 초과되었습니다.',
    action: '다시 시도'
  },
  [ErrorCode.OFFLINE_ERROR]: {
    title: '오프라인 상태',
    message: '인터넷에 연결되어 있지 않습니다.',
    action: '연결 확인'
  },
  [ErrorCode.API_ERROR]: {
    title: '서버 오류',
    message: '서버에 문제가 발생했습니다.',
    action: '잠시 후 다시 시도'
  },
  [ErrorCode.SERVER_ERROR]: {
    title: '서버 오류',
    message: '서버에 일시적인 문제가 발생했습니다.',
    action: '잠시 후 다시 시도'
  },
  [ErrorCode.CLIENT_ERROR]: {
    title: '요청 오류',
    message: '잘못된 요청입니다.',
    action: '다시 시도'
  },
  [ErrorCode.UNAUTHORIZED]: {
    title: '인증 필요',
    message: '로그인이 필요합니다.',
    action: '로그인'
  },
  [ErrorCode.FORBIDDEN]: {
    title: '접근 권한 없음',
    message: '이 기능에 접근할 권한이 없습니다.',
    action: '관리자 문의'
  },
  [ErrorCode.VALIDATION_ERROR]: {
    title: '입력 오류',
    message: '입력한 정보를 확인해주세요.',
    action: '수정'
  },
  [ErrorCode.NOT_FOUND]: {
    title: '찾을 수 없음',
    message: '요청한 정보를 찾을 수 없습니다.',
    action: '다시 시도'
  },
  [ErrorCode.UNKNOWN_ERROR]: {
    title: '알 수 없는 오류',
    message: '예상치 못한 오류가 발생했습니다.',
    action: '다시 시도'
  },
};

// 에러 분류 함수
export const classifyError = (error: any): AppError => {
  // 네트워크 에러
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    return {
      code: ErrorCode.NETWORK_ERROR,
      message: error.message,
      userMessage: ERROR_MESSAGES[ErrorCode.NETWORK_ERROR].message,
    };
  }
  
  // 타임아웃 에러
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return {
      code: ErrorCode.TIMEOUT_ERROR,
      message: error.message,
      userMessage: ERROR_MESSAGES[ErrorCode.TIMEOUT_ERROR].message,
    };
  }
  
  // HTTP 상태 코드별 에러
  if (error.response?.status) {
    const status = error.response.status;
    
    if (status === 401) {
      return {
        code: ErrorCode.UNAUTHORIZED,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorCode.UNAUTHORIZED].message,
      };
    }
    
    if (status === 403) {
      return {
        code: ErrorCode.FORBIDDEN,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorCode.FORBIDDEN].message,
      };
    }
    
    if (status === 404) {
      return {
        code: ErrorCode.NOT_FOUND,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorCode.NOT_FOUND].message,
      };
    }
    
    if (status >= 500) {
      return {
        code: ErrorCode.SERVER_ERROR,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorCode.SERVER_ERROR].message,
      };
    }
    
    if (status >= 400) {
      return {
        code: ErrorCode.CLIENT_ERROR,
        message: error.message,
        userMessage: ERROR_MESSAGES[ErrorCode.CLIENT_ERROR].message,
      };
    }
  }
  
  // 기본 에러
  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: error.message || 'Unknown error',
    userMessage: ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR].message,
  };
};
