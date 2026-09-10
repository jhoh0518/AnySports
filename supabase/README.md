# Supabase 스키마 설치

1. Supabase Dashboard에서 프로젝트를 엽니다.
2. **SQL Editor → New query**를 선택합니다.
3. `schema.sql` 전체를 붙여넣고 **Run**을 누릅니다.
4. 루트 `.env`에 Project URL과 publishable key를 입력합니다.
5. 앱을 재실행하거나 **설정 → 데이터 소스**를 누릅니다.
6. **Supabase 연결됨**을 확인합니다.

공개 스포츠 데이터는 읽기만 허용되고 사용자 데이터는 본인 행만 접근할 수 있습니다. 모바일 앱에는 Project URL과 publishable key만 넣고 DB 비밀번호, secret 또는 service-role key를 넣지 마세요.
