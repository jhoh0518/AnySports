# AnySports

여러 스포츠의 관심 팀 일정과 소식을 한 화면에 모으는 개인용 모바일 앱 프로토타입입니다.

## 현재 버전

`0.1.0` — Supabase 연결 전 로컬 샘플 데이터 빌드

## 구현된 기능

- `전체` 홈에서 EPL, LCK, F1 일정과 소식을 통합 표시
- 리그명 대신 전용 마크를 사용하는 리그 필터와 새 소식 점 표시
- 기본 관심 팀: 맨체스터 시티, 디플러스 기아, 스쿠데리아 페라리
- 팀 다중 선택과 리그 `관찰자` 선택
- 선택 팀의 국제전(UEFA 챔피언스리그, 월드 챔피언십) 일정 포함
- 일정, 소식, 설정 탭
- 소식 읽음 상태와 관심/알림 설정의 기기 로컬 캐시
- 시작 카테고리 및 향후 캘린더 동기화 옵션

표시되는 경기와 기사는 실제 실시간 데이터가 아닌 UI 검증용 샘플입니다.

## 실행

요구 사항: Node.js 20.19.4 이상(또는 22.13 이상), npm.

```bash
npm install
npm run start
```

Android 기기에서 테스트하려면 Expo Go로 QR 코드를 읽거나, `Builds/AnySports_0.1.0.apk`를 설치합니다. APK는 개인 테스트용 디버그 인증서로 서명되어 있습니다.

## 구조

- `src/screens`: 홈, 일정, 소식, 설정 화면
- `src/components`: 재사용 UI 컴포넌트
- `src/data/mockData.ts`: 프로토타입 샘플 데이터
- `src/services/sportsDataProvider.ts`: 데이터 소스 인터페이스
- `src/services/localCache.ts`: 사용자 설정과 읽음 상태 캐시
- `docs/SUPABASE_SETUP.md`: 다음 단계의 Supabase 연결 계획

## 보안

`.env`와 `Database Password.txt`는 제외됩니다. 모바일 앱에는 Supabase Project URL과 publishable key만 둘 수 있으며, 데이터베이스 비밀번호·secret key·service role key는 절대 포함하면 안 됩니다.

