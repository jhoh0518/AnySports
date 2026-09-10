# AnySports

관심 팀의 EPL, LCK, F1 일정과 소식을 통합하는 Android 앱 프로토타입입니다.

## 현재 버전
`0.2.0` — Supabase 원격 데이터, 마지막 성공 캐시 및 샘플 폴백

## 실행
```bash
npm install
cp .env.example .env
# .env에 실제 Supabase Project URL과 publishable key 입력
npm run typecheck
npm run start
```

## Supabase 활성화
1. Supabase SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다.
2. `.env`에 Project URL과 publishable key를 입력합니다.
3. 앱을 재실행하거나 **설정 → 데이터 소스**를 누릅니다.
4. **Supabase 연결됨**을 확인합니다.

처음 하는 사용자는 [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)의 상세 순서를 따라 하세요. 원격 조회가 실패하면 마지막 성공 캐시를 유지하고, 캐시가 없으면 내장 샘플을 표시합니다.

## 보안
`.env`, DB 비밀번호, secret 및 service-role key는 저장소나 APK에 포함하지 않습니다. 모바일 앱에는 Project URL과 publishable key만 사용합니다.
