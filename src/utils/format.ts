import { LeagueId } from '../types/domain';

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  month: 'long', day: 'numeric', weekday: 'short',
});

const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  hour: '2-digit', minute: '2-digit', hour12: false,
});

export function formatEventDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatEventTime(value: string): string {
  return timeFormatter.format(new Date(value));
}

export function formatRelativeTime(value: string): string {
  const diff = Date.now() - new Date(value).getTime();
  const hours = Math.max(1, Math.floor(diff / 3_600_000));
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export function matchesLeague<T extends { leagueId: Exclude<LeagueId, 'all'> }>(
  item: T,
  league: LeagueId,
): boolean {
  return league === 'all' || item.leagueId === league;
}

