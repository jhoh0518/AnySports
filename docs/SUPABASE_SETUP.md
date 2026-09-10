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

### `leagues`가 있는데도 “스키마 설정 필요”라고 나올 때
앱은 `leagues`뿐 아니라 `entities`, `competitions`, `events`, `event_entities`, `articles`, `article_entities`도 함께 요청합니다. 이 중 하나가 없거나 필요한 열이 없으면 해당 메시지가 표시됩니다. 최신 앱은 오류 메시지에 문제가 발생한 테이블 이름과 `PGRST` 오류 코드를 함께 보여줍니다.

1. SQL Editor에서 `supabase/schema.sql` **전체**를 다시 실행합니다. 파일의 마지막 `notify pgrst, 'reload schema';`가 Data API 스키마 캐시 새로고침을 요청합니다.
2. Table Editor에서 위의 일곱 테이블이 모두 있는지 확인합니다.
3. 아래 진단 SQL을 SQL Editor에서 실행합니다. 모든 결과가 실제 테이블 이름으로 나와야 합니다.
```sql
select
  to_regclass('public.leagues') as leagues,
  to_regclass('public.entities') as entities,
  to_regclass('public.competitions') as competitions,
  to_regclass('public.events') as events,
  to_regclass('public.event_entities') as event_entities,
  to_regclass('public.articles') as articles,
  to_regclass('public.article_entities') as article_entities;
```
4. 앱을 완전히 종료해 다시 실행한 뒤 **설정 → 데이터 소스**를 누릅니다.

