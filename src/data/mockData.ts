import { AppDataSnapshot, AppPreferences } from '../types/domain';

export const mockSnapshot: AppDataSnapshot = {
  leagues: [
    { id: 'epl', name: '프리미어리그', sport: '축구', color: '#7357FF' },
    { id: 'lck', name: 'LCK', sport: '리그 오브 레전드', color: '#E9EEF5' },
    { id: 'f1', name: 'Formula 1', sport: '모터스포츠', color: '#FF374B' },
  ],
  entities: [
    { id: 'man-city', leagueId: 'epl', name: '맨체스터 시티', shortName: 'MCI', color: '#6CABDD', role: 'team' },
    { id: 'arsenal', leagueId: 'epl', name: '아스널', shortName: 'ARS', color: '#EF0107', role: 'team' },
    { id: 'liverpool', leagueId: 'epl', name: '리버풀', shortName: 'LIV', color: '#C8102E', role: 'team' },
    { id: 'dplus-kia', leagueId: 'lck', name: '디플러스 기아', shortName: 'DK', color: '#E9EEF5', role: 'team' },
    { id: 'gen-g', leagueId: 'lck', name: '젠지', shortName: 'GEN', color: '#AA8B40', role: 'team' },
    { id: 't1', leagueId: 'lck', name: 'T1', shortName: 'T1', color: '#E2012D', role: 'team' },
    { id: 'ferrari', leagueId: 'f1', name: '스쿠데리아 페라리', shortName: 'FER', color: '#E80020', role: 'constructor' },
    { id: 'mclaren', leagueId: 'f1', name: '맥라렌', shortName: 'MCL', color: '#FF8700', role: 'constructor' },
    { id: 'mercedes', leagueId: 'f1', name: '메르세데스', shortName: 'MER', color: '#00A19C', role: 'constructor' },
    { id: 'epl-observer', leagueId: 'epl', name: '프리미어리그 관찰자', shortName: 'ALL', color: '#7357FF', role: 'observer' },
    { id: 'lck-observer', leagueId: 'lck', name: 'LCK 관찰자', shortName: 'ALL', color: '#E9EEF5', role: 'observer' },
    { id: 'f1-observer', leagueId: 'f1', name: 'F1 관찰자', shortName: 'ALL', color: '#FF374B', role: 'observer' },
  ],
  events: [
    {
      id: 'evt-city-arsenal', leagueId: 'epl', competition: '프리미어리그',
      title: '맨체스터 시티 vs 아스널', subtitle: '정규 시즌 · 4라운드',
      startsAt: '2026-09-12T20:30:00+09:00', venue: '에티하드 스타디움',
      followedEntityIds: ['man-city'], status: 'scheduled',
    },
    {
      id: 'evt-f1-italy', leagueId: 'f1', competition: 'Formula 1',
      title: '이탈리아 그랑프리', subtitle: '결승 · 53랩',
      startsAt: '2026-09-13T22:00:00+09:00', venue: '몬차',
      followedEntityIds: ['ferrari'], status: 'scheduled',
    },
    {
      id: 'evt-dk-kt', leagueId: 'lck', competition: 'LCK',
      title: '디플러스 기아 vs KT 롤스터', subtitle: '플레이오프 · 2라운드',
      startsAt: '2026-09-15T17:00:00+09:00', venue: '롤파크',
      followedEntityIds: ['dplus-kia'], status: 'scheduled',
    },
    {
      id: 'evt-city-ucl', leagueId: 'epl', competition: 'UEFA 챔피언스리그',
      title: '맨체스터 시티 vs 바이에른', subtitle: '리그 페이즈 · 1차전',
      startsAt: '2026-09-17T04:00:00+09:00', venue: '에티하드 스타디움',
      followedEntityIds: ['man-city'], status: 'scheduled', isInternational: true,
    },
    {
      id: 'evt-f1-baku', leagueId: 'f1', competition: 'Formula 1',
      title: '아제르바이잔 그랑프리', subtitle: '결승 · 51랩',
      startsAt: '2026-09-27T20:00:00+09:00', venue: '바쿠 시티 서킷',
      followedEntityIds: ['ferrari'], status: 'scheduled',
    },
    {
      id: 'evt-dk-worlds', leagueId: 'lck', competition: '월드 챔피언십',
      title: '디플러스 기아 · 스위스 스테이지', subtitle: '상대 추후 공개',
      startsAt: '2026-10-08T18:00:00+09:00', venue: '상하이',
      followedEntityIds: ['dplus-kia'], status: 'scheduled', isInternational: true,
    },
  ],
  news: [
    {
      id: 'news-city-squad', leagueId: 'epl',
      title: '시티, 주말 빅매치 앞두고 최종 훈련',
      summary: '아스널전을 앞둔 선수단의 컨디션과 예상 선발 명단을 정리했습니다.',
      source: 'Manchester City', publishedAt: '2026-09-09T08:25:00+09:00',
      followedEntityIds: ['man-city'], accent: '#6CABDD', category: '팀 소식',
    },
    {
      id: 'news-ferrari-upgrade', leagueId: 'f1',
      title: '페라리, 몬차용 저다운포스 패키지 공개',
      summary: '홈 그랑프리를 위해 준비한 새로운 플로어와 리어 윙 구성이 공개됐습니다.',
      source: 'Formula 1', publishedAt: '2026-09-09T07:10:00+09:00',
      followedEntityIds: ['ferrari'], accent: '#E80020', category: '테크니컬',
    },
    {
      id: 'news-dk-playoffs', leagueId: 'lck',
      title: '디플러스 기아, 플레이오프 2라운드 준비 돌입',
      summary: '정규 시즌 데이터로 살펴본 핵심 밴픽과 주목할 라인을 확인하세요.',
      source: 'LoL Esports', publishedAt: '2026-09-08T21:40:00+09:00',
      followedEntityIds: ['dplus-kia'], accent: '#C6D0DB', category: '프리뷰',
    },
    {
      id: 'news-ucl-draw', leagueId: 'epl',
      title: '챔피언스리그 리그 페이즈 일정 확정',
      summary: '맨체스터 시티의 유럽 대항전 전체 일정이 캘린더에 반영됐습니다.',
      source: 'UEFA', publishedAt: '2026-09-08T18:15:00+09:00',
      followedEntityIds: ['man-city'], accent: '#4155C8', category: '일정 변경',
    },
    {
      id: 'news-f1-weather', leagueId: 'f1',
      title: '몬차 주말, 일요일 소나기 가능성',
      summary: '현재 예보 기준 결승 중반 짧은 비가 내릴 가능성이 있습니다.',
      source: 'FIA', publishedAt: '2026-09-08T16:00:00+09:00',
      followedEntityIds: ['ferrari'], accent: '#FF374B', category: '레이스 위크',
    },
  ],
};

export const defaultPreferences: AppPreferences = {
  defaultLeague: 'all',
  followedEntityIds: ['man-city', 'dplus-kia', 'ferrari'],
  calendarSync: false,
  calendarScope: 'followed',
  eventReminder: true,
  newsNotifications: true,
};
