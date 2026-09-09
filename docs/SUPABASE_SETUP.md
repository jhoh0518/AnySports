# Supabase 연결 계획

현재 `0.1.0`은 화면과 사용자 흐름을 빠르게 검증하기 위해 `MockSportsDataProvider`를 사용합니다. UI 피드백이 정리된 다음 Supabase를 연결합니다.

## 연결 시점에 사용자가 할 일

1. Supabase에서 새 프로젝트를 만듭니다.
2. Project URL과 `sb_publishable_...` 형식의 publishable key만 로컬 `.env`에 입력합니다.
3. 데이터베이스 비밀번호는 비밀번호 관리자에 보관합니다. 대화, 소스 코드, APK, `.env`에 넣지 않습니다.
4. 앱에서 이메일 로그인 또는 익명 로그인을 사용할지 선택합니다. 개인 테스트 단계에는 이메일 로그인 한 계정이 단순합니다.

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
```

## 예정 테이블

- `leagues`: EPL, LCK, F1
- `competitions`: 프리미어리그, UEFA 대회, LCK, MSI, Worlds, F1 시즌
- `entities`: 팀/컨스트럭터와 관찰자 대상
- `events`: 경기·레이스 일정, 상태, 변경 시각
- `articles`: 제목, 요약, 원문 URL, 발행 시각
- `event_entities`, `article_entities`: 일정/기사와 팀의 다대다 관계
- `user_follows`: 사용자별 관심 팀/관찰자
- `user_preferences`: 시작 화면, 캘린더, 알림 설정
- `user_article_reads`: 읽음 상태
- `ingestion_runs`: 한 시간 단위 수집 성공/실패 기록

## 보안 원칙

- 모든 사용자 테이블에 RLS를 켭니다.
- `auth.uid() = user_id`인 행만 조회·수정하도록 정책을 둡니다.
- 공개 스포츠 데이터는 로그인 사용자에게 읽기만 허용합니다.
- 데이터 수집 함수만 관리자 권한으로 `events`와 `articles`를 쓰게 합니다.
- service role/secret key는 Supabase Edge Function의 secret으로만 보관합니다.
- 앱에서 데이터베이스에 직접 SQL 연결하거나 DB 비밀번호를 사용하지 않습니다.

## 앱 연결 방식

`src/services/sportsDataProvider.ts`의 인터페이스를 구현하는 `SupabaseSportsDataProvider`를 추가합니다. 화면은 변경하지 않고 provider 인스턴스만 교체합니다. 서버 데이터가 일시적으로 없을 때는 마지막 성공 응답을 로컬 캐시에서 표시합니다.

## 한 시간 수집 흐름

Supabase Cron이 Edge Function을 매시간 호출합니다. 함수는 공식 일정/뉴스 소스를 확인하고, 원본의 안정적인 ID와 수정 시각을 기준으로 upsert합니다. 일정 변경은 기존 행을 수정하고 변경 로그를 남깁니다. 앱은 실행/새로고침 시 Supabase 최신 데이터를 읽습니다.

초기 수집 후보는 Premier League/구단/UEFA 공식 일정, LoL Esports의 LCK·국제대회 페이지, Formula 1/FIA 공식 일정과 뉴스입니다. 실제 수집 구현 전에는 각 사이트의 이용 약관, robots 정책, 재배포 범위를 확인해야 합니다.

