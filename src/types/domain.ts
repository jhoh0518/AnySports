export type LeagueId = 'all' | 'epl' | 'lck' | 'f1';
export type ContentLeagueId = Exclude<LeagueId, 'all'>;
export type MainTabId = 'home' | 'schedule' | 'news' | 'settings';

export interface League {
  id: ContentLeagueId;
  name: string;
  sport: string;
  color: string;
}

export interface FollowedEntity {
  id: string;
  leagueId: ContentLeagueId;
  name: string;
  shortName: string;
  color: string;
  role: 'team' | 'constructor' | 'observer';
}

export interface SportsEvent {
  id: string;
  leagueId: ContentLeagueId;
  competition: string;
  title: string;
  subtitle: string;
  startsAt: string;
  venue?: string;
  followedEntityIds: string[];
  status: 'scheduled' | 'completed' | 'postponed';
  result?: string;
  isInternational?: boolean;
}

export interface NewsItem {
  id: string;
  leagueId: ContentLeagueId;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  followedEntityIds: string[];
  accent: string;
  category: string;
}

export interface AppPreferences {
  defaultLeague: LeagueId;
  followedEntityIds: string[];
  calendarSync: boolean;
  calendarScope: 'followed' | 'all';
  eventReminder: boolean;
  newsNotifications: boolean;
}

export interface AppDataSnapshot {
  leagues: League[];
  entities: FollowedEntity[];
  events: SportsEvent[];
  news: NewsItem[];
}

