# SmallStep Frontend v2.0.0

SmallStep 프론트엔드 - v2 주간 적응형 AI 코치

## 주요 변경사항 (v2)

- **순서 기반 태스크 시스템**: 날짜별 활동 → 순서 기반 태스크 (LOCKED → AVAILABLE → COMPLETED/SKIPPED)
- **Phase 타임라인**: 목표 달성을 위한 단계별 진행 상황 시각화
- **AI 코치 통합**: 목표 등록 시 Phase 자동 생성, 주간 계획 자동 생성
- **게이미피케이션**: XP/레벨/스트릭 시스템

## 환경 설정

### .env 파일 설정

프로젝트 루트에 `.env` 파일을 생성하여 환경 변수를 설정합니다.

**`.env` 파일 예시 (개발용):**
```bash
API_BASE_URL=http://172.30.1.97:8000
ENVIRONMENT=development
DEBUG=true
```

**중요:**
- `API_BASE_URL`: 백엔드 서버가 실행 중인 컴퓨터의 로컬 네트워크 IP 주소를 입력해야 합니다.
  - Windows: `ipconfig` 명령어로 확인
  - 백엔드가 실행된 컴퓨터의 IP 주소를 사용 (localhost가 아닌 실제 IP)
  - 예: `http://192.168.0.100:8000` (백엔드 포트에 맞게 수정)
- `localhost` 또는 `127.0.0.1`은 사용하지 않습니다 (실제 기기/에뮬레이터에서 접근 불가)

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

- `.env` 파일은 git에 커밋하지 않음 (`.gitignore`에 포함됨)
- 실제 API URL은 `.env` 파일에만 저장
- IP 주소 변경 시 `.env` 파일만 수정하면 됨
