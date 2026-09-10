# 초보자를 위한 Supabase 연결 안내

## 준비물
- Supabase 계정과 프로젝트
- 이 저장소를 받은 PC
- Supabase Dashboard의 Project URL과 publishable key

## 1. 데이터베이스 만들기
1. Supabase Dashboard에 로그인하고 AnySports에 사용할 프로젝트를 엽니다.
2. 왼쪽 **SQL Editor**를 누릅니다.
3. **New query**를 누릅니다.
4. 저장소의 `supabase/schema.sql` 파일을 텍스트 편집기로 열고 전부 복사합니다.
5. SQL Editor에 붙여넣고 **Run**을 누릅니다.
6. 화면에 오류가 없으면 **Table Editor**를 열어 `leagues` 테이블에 `epl`, `lck`, `f1`이 보이는지 확인합니다.

## 2. 앱에 공개 연결값 넣기
1. Dashboard의 **Project Settings → API**를 엽니다.
2. Project URL과 `sb_publishable_...` 형식의 키를 찾습니다.
3. 프로젝트 루트에서 `.env.example`을 복사해 이름을 `.env`로 바꿉니다.
4. 아래 자리표시자를 실제 값으로 바꾸고 저장합니다.
```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```
DB 비밀번호, `sb_secret_...`, service role key는 절대 넣지 마세요. `.env`는 Git에서 제외됩니다.

## 3. 실행하고 확인하기
```bash
npm install
npm run typecheck
npm run start
```
Expo가 이미 실행 중이었다면 종료하고 다시 시작해야 새 환경변수가 반영됩니다. 앱에서 **설정 → 데이터 소스**를 누르세요. `연결됨` 또는 홈의 `Supabase 연결됨`이 보이면 완료입니다.

## 문제가 생기면
- **스키마 설정 필요**: 1단계의 `schema.sql`을 전체 실행하세요.
- **환경 설정 필요**: `.env` 파일명과 두 변수의 철자를 확인하고 Expo를 재시작하세요.
- **권한 오류**: SQL을 다시 전체 실행해 RLS 정책을 적용하세요.
- **네트워크 오류**: 인터넷 연결과 Project URL을 확인한 뒤 데이터 소스를 다시 누르세요.
- 계속 실패하면 Dashboard **Table Editor**에서 `leagues`가 존재하는지 먼저 확인하세요.
