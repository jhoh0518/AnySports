import { AppDataSnapshot, ContentLeagueId, FollowedEntity, NewsItem, SportsEvent } from '../types/domain';
import { mockSnapshot } from '../data/mockData';
import { isSupabaseConfigured, supabase } from './supabaseClient';

export type DataProviderErrorCode = 'not_configured' | 'schema_missing' | 'permission_denied' | 'network' | 'unknown';

export class DataProviderError extends Error {
  constructor(public readonly code: DataProviderErrorCode, message: string) {
    super(message);
    this.name = 'DataProviderError';
  }
}

export interface SportsDataProvider {
  getSnapshot(): Promise<AppDataSnapshot>;
  refresh(): Promise<AppDataSnapshot>;
}

class MockSportsDataProvider implements SportsDataProvider {
  async getSnapshot(): Promise<AppDataSnapshot> {
    return mockSnapshot;
  }

  async refresh(): Promise<AppDataSnapshot> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return mockSnapshot;
  }
}

type RelationId = { entity_id: string };
type CompetitionRelation = { name: string } | { name: string }[] | null;

interface EventRow {
  id: string;
  league_id: ContentLeagueId;
  title: string;
  subtitle: string;
  starts_at: string;
  venue: string | null;
  status: SportsEvent['status'];
  result: string | null;
  is_international: boolean;
  competitions: CompetitionRelation;
  event_entities: RelationId[] | null;
}

interface ArticleRow {
  id: string;
  league_id: ContentLeagueId;
  title: string;
  summary: string;
  source: string;
  published_at: string;
  accent: string;
  category: string;
  article_entities: RelationId[] | null;
}

function relationName(value: CompetitionRelation): string {
  if (Array.isArray(value)) return value[0]?.name ?? '기타 대회';
  return value?.name ?? '기타 대회';
}

function classifyError(error: { code?: string; message?: string }): DataProviderError {
  const message = error.message ?? 'Supabase 요청에 실패했습니다.';
  if (error.code === 'PGRST205' || error.code === '42P01' || /could not find the table|does not exist/i.test(message)) {
    return new DataProviderError('schema_missing', 'AnySports 데이터베이스 스키마가 아직 설치되지 않았습니다.');
  }
  if (error.code === '42501' || /permission|row-level security/i.test(message)) {
    return new DataProviderError('permission_denied', 'Supabase RLS 또는 테이블 권한을 확인해 주세요.');
  }
  if (/network|fetch|timeout/i.test(message)) {
    return new DataProviderError('network', 'Supabase 서버에 연결할 수 없습니다.');
  }
  return new DataProviderError('unknown', message);
}

class SupabaseSportsDataProvider implements SportsDataProvider {
  async getSnapshot(): Promise<AppDataSnapshot> {
    if (!supabase) throw new DataProviderError('not_configured', 'Supabase 환경 변수가 설정되지 않았습니다.');

    const [leaguesQuery, entitiesQuery, eventsQuery, newsQuery] = await Promise.all([
      supabase.from('leagues').select('id,name,sport,color').eq('enabled', true).order('sort_order'),
      supabase.from('entities').select('id,league_id,name,short_name,color,role').eq('enabled', true).order('sort_order'),
      supabase.from('events').select('id,league_id,title,subtitle,starts_at,venue,status,result,is_international,competitions(name),event_entities(entity_id)').order('starts_at'),
      supabase.from('articles').select('id,league_id,title,summary,source,published_at,accent,category,article_entities(entity_id)').order('published_at', { ascending: false }).limit(100),
    ]);

    const firstError = leaguesQuery.error ?? entitiesQuery.error ?? eventsQuery.error ?? newsQuery.error;
    if (firstError) throw classifyError(firstError);

    const leagues = (leaguesQuery.data ?? []).map((row) => ({
      id: row.id as ContentLeagueId,
      name: row.name,
      sport: row.sport,
      color: row.color,
    }));

    const entities: FollowedEntity[] = (entitiesQuery.data ?? []).map((row) => ({
      id: row.id,
      leagueId: row.league_id as ContentLeagueId,
      name: row.name,
      shortName: row.short_name,
      color: row.color,
      role: row.role as FollowedEntity['role'],
    }));

    const events: SportsEvent[] = ((eventsQuery.data ?? []) as unknown as EventRow[]).map((row) => ({
      id: row.id,
      leagueId: row.league_id,
      competition: relationName(row.competitions),
      title: row.title,
      subtitle: row.subtitle,
      startsAt: row.starts_at,
      venue: row.venue ?? undefined,
      followedEntityIds: (row.event_entities ?? []).map((relation) => relation.entity_id),
      status: row.status,
      result: row.result ?? undefined,
      isInternational: row.is_international,
    }));

    const news: NewsItem[] = ((newsQuery.data ?? []) as unknown as ArticleRow[]).map((row) => ({
      id: row.id,
      leagueId: row.league_id,
      title: row.title,
      summary: row.summary,
      source: row.source,
      publishedAt: row.published_at,
      followedEntityIds: (row.article_entities ?? []).map((relation) => relation.entity_id),
      accent: row.accent,
      category: row.category,
    }));

    return { leagues, entities, events, news };
  }

  async refresh(): Promise<AppDataSnapshot> {
    return this.getSnapshot();
  }
}

export const sportsDataProvider: SportsDataProvider = isSupabaseConfigured
  ? new SupabaseSportsDataProvider()
  : new MockSportsDataProvider();
