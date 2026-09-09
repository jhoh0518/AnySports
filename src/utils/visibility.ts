import { FollowedEntity, NewsItem, SportsEvent } from '../types/domain';

type FeedItem = NewsItem | SportsEvent;

export function isVisibleForFollowing(item: FeedItem, followedIds: Set<string>, entities: FollowedEntity[]): boolean {
  if (item.followedEntityIds.some((id) => followedIds.has(id))) return true;
  return entities.some((entity) => (
    entity.leagueId === item.leagueId
    && entity.role === 'observer'
    && followedIds.has(entity.id)
  ));
}

