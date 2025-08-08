# SmallStep Frontend

## 환경 설정

### .env 파일 설정

환경별로 다른 `.env` 파일을 생성하여 사용합니다:

**`.env.development` (개발용):**
```bash
API_BASE_URL=http://localhost:8000
DEBUG=true
ENVIRONMENT=development
```

**`.env.staging` (스테이징용):**
```bash
API_BASE_URL=https://your-staging-api.com
DEBUG=true
ENVIRONMENT=staging
```

**`.env.production` (프로덕션용):**
```bash
API_BASE_URL=https://your-production-api.com
DEBUG=false
ENVIRONMENT=production
```

### 앱 실행

```bash
npm start
```

### EAS Build

**개발 빌드:**
```bash
eas build --profile development --platform ios
```

**스테이징 빌드:**
```bash
eas build --profile preview --platform ios
```

**프로덕션 빌드:**
```bash
eas build --profile production --platform ios
```

## 보안

- `.env` 파일들은 git에 커밋하지 않음
- 실제 API URL은 .env 파일에만 저장
- 환경별로 다른 .env 파일 사용
