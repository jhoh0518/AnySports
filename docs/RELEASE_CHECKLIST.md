# 릴리스 체크리스트

- 버전: `0.1.0`, Android versionCode `1`
- 애플리케이션 ID: `com.anysports.app`
- TypeScript strict 검사 통과
- Expo Android 번들 생성 통과
- Android SDK 36 릴리스 APK 생성 통과
- APK v2 서명 검증 통과
- 허용 권한: `android.permission.INTERNET`만 사용
- APK와 소스 ZIP에서 `.env`, 데이터베이스 비밀번호, 로컬 SDK 제외

현재 APK는 개인 테스트용 디버그 인증서로 서명됩니다. 스토어 배포 전에 별도의 릴리스 키를 생성하고 안전하게 보관해야 합니다.

