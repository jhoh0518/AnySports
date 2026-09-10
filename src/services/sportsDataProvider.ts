import { PostgrestError } from '@supabase/supabase-js';
import { AppDataSnapshot, ConnectionStatus, ContentLeagueId, FollowedEntity, League, NewsItem, SportsEvent } from '../types/domain';
import { hasSupabaseConfiguration, supabase } from './supabaseClient';

interface LeagueRow { id: string; name: string; sport: string; color: string }
interface EntityRow { id: string; league_id: string; name: string; short_name: string; color: string; role: FollowedEntity['role'] }
interface CompetitionRow { id: string; name: string; is_international: boolean }
interface EventRow { id: string; league_id: string; competition_id: string; title: string; subtitle: string; starts_at: string; venue: string | null; status: SportsEvent['status']; result: string | null; event_entities: { entity_id: string }[] | null }
interface ArticleRow { id: string; league_id: string; title: string; summary: string; source: string; published_at: string; accent: string; category: string; article_entities: { entity_id: string }[] | null }

export class SportsDataError extends Error {
  constructor(public readonly status: ConnectionStatus, message: string) { super(message); }
}
function isLeagueId(value: string): value is ContentLeagueId { return value === 'epl' || value === 'lck' || value === 'f1'; }
function classify(error: PostgrestError): SportsDataError {
  if (error.code === 'PGRST205' || /schema cache|could not find the table/i.test(error.message)) return new SportsDataError('schema-required', 'AnySports 데이터베이스 스키마를 먼저 설치해 주세요.');
  if (error.code === '42501' || /permission|row-level security|not authorized/i.test(error.message)) return new SportsDataError('permission-error', 'Supabase RLS와 읽기 권한을 확인해 주세요.');
  return new SportsDataError('unknown-error', error.message);
}
function rows<T>(data: T[] | null, error: PostgrestError | null): T[] { if (error) throw classify(error); return data ?? []; }

export interface SportsDataProvider { getSnapshot(): Promise<AppDataSnapshot>; refresh(): Promise<AppDataSnapshot> }
class SupabaseSportsDataProvider implements SportsDataProvider {
  async getSnapshot(): Promise<AppDataSnapshot> {
    if (!hasSupabaseConfiguration || !supabase) throw new SportsDataError('configuration-required', 'Supabase URL과 publishable key를 .env에 설정해 주세요.');
    try {
      const [lr, er, cr, vr, ar] = await Promise.all([
        supabase.from('leagues').select('id,name,sport,color').order('sort_order'),
        supabase.from('entities').select('id,league_id,name,short_name,color,role').order('sort_order'),
        supabase.from('competitions').select('id,name,is_international'),
        supabase.from('events').select('id,league_id,competition_id,title,subtitle,starts_at,venue,status,result,event_entities(entity_id)').order('starts_at'),
        supabase.from('articles').select('id,league_id,title,summary,source,published_at,accent,category,article_entities(entity_id)').order('published_at', { ascending: false }),
      ]);
      const leagueRows = rows(lr.data as LeagueRow[] | null, lr.error);
      const entityRows = rows(er.data as EntityRow[] | null, er.error);
      const competitionRows = rows(cr.data as CompetitionRow[] | null, cr.error);
      const eventRows = rows(vr.data as unknown as EventRow[] | null, vr.error);
      const articleRows = rows(ar.data as unknown as ArticleRow[] | null, ar.error);
      const competitions = new Map(competitionRows.map((row) => [row.id, row]));
      const leagues: League[] = leagueRows.filter((r) => isLeagueId(r.id)).map((r) => ({ id: r.id as ContentLeagueId, name: r.name, sport: r.sport, color: r.color }));
      const entities: FollowedEntity[] = entityRows.filter((r) => isLeagueId(r.league_id)).map((r) => ({ id: r.id, leagueId: r.league_id as ContentLeagueId, name: r.name, shortName: r.short_name, color: r.color, role: r.role }));
      const events: SportsEvent[] = eventRows.filter((r) => isLeagueId(r.league_id)).map((r) => { const c = competitions.get(r.competition_id); return { id: r.id, leagueId: r.league_id as ContentLeagueId, competition: c?.name ?? '대회', title: r.title, subtitle: r.subtitle, startsAt: r.starts_at, venue: r.venue ?? undefined, followedEntityIds: r.event_entities?.map((x) => x.entity_id) ?? [], status: r.status, result: r.result ?? undefined, isInternational: c?.is_international ?? false }; });
      const news: NewsItem[] = articleRows.filter((r) => isLeagueId(r.league_id)).map((r) => ({ id: r.id, leagueId: r.league_id as ContentLeagueId, title: r.title, summary: r.summary, source: r.source, publishedAt: r.published_at, followedEntityIds: r.article_entities?.map((x) => x.entity_id) ?? [], accent: r.accent, category: r.category }));
      if (!leagues.length) throw new SportsDataError('schema-required', '리그 데이터가 비어 있습니다. schema.sql을 적용해 주세요.');
      return { leagues, entities, events, news };
    } catch (error) {
      if (error instanceof SportsDataError) throw error;
      throw new SportsDataError('network-error', 'Supabase에 연결할 수 없습니다. 네트워크를 확인해 주세요.');
    }
  }
  refresh(): Promise<AppDataSnapshot> { return this.getSnapshot(); }
}
export const sportsDataProvider: SportsDataProvider = new SupabaseSportsDataProvider();
