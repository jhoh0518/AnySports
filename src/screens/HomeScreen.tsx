import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EventCard } from '../components/EventCard';
import { LeagueFilter } from '../components/LeagueFilter';
import { LeagueMark } from '../components/LeagueMark';
import { NewsCard } from '../components/NewsCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeader } from '../components/SectionHeader';
import { useAppState } from '../state/AppState';
import { colors, radii } from '../theme';
import { matchesLeague } from '../utils/format';
import { isVisibleForFollowing } from '../utils/visibility';

export function HomeScreen() {
  const {
    data, preferences, selectedLeague, setSelectedLeague, setActiveTab,
    readNewsIds, markNewsRead, refreshing, refreshData, connection,
  } = useAppState();

  const followed = data.entities.filter((entity) => preferences.followedEntityIds.includes(entity.id));
  const followedIds = new Set(preferences.followedEntityIds);
  const events = data.events
    .filter((event) => isVisibleForFollowing(event, followedIds, data.entities))
    .filter((event) => matchesLeague(event, selectedLeague))
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
  const news = data.news
    .filter((item) => isVisibleForFollowing(item, followedIds, data.entities))
    .filter((item) => matchesLeague(item, selectedLeague))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));

  const unreadByLeague = useMemo(() => {
    const result: Partial<Record<'all' | 'epl' | 'lck' | 'f1', boolean>> = {};
    for (const item of data.news) {
      if (!readNewsIds.has(item.id) && isVisibleForFollowing(item, followedIds, data.entities)) {
        result[item.leagueId] = true;
        result.all = true;
      }
    }
    return result;
  }, [data.news, preferences.followedEntityIds, readNewsIds]);

  const nextEvent = events[0];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} tintColor={colors.mint} />}
    >
      <ScreenHeader
        eyebrow="YOUR SPORTS, ONE PLACE"
        title="오늘의 스포츠"
        trailing={<View style={styles.profile}><Text style={styles.profileText}>AS</Text><View style={styles.online} /></View>}
      />

      <LeagueFilter value={selectedLeague} unreadByLeague={unreadByLeague} onChange={setSelectedLeague} />

      <View style={styles.followedStrip}>
        <Text style={styles.followedLabel}>MY TEAMS</Text>
        <View style={styles.followedRow}>
          {followed.filter((entity) => entity.role !== 'observer').map((entity) => (
            <View key={entity.id} style={styles.teamPill}>
              <View style={[styles.teamDot, { backgroundColor: entity.color }]} />
              <Text style={styles.teamName}>{entity.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {nextEvent ? (
        <View style={styles.section}>
          <SectionHeader title="다음 일정" caption="관심 팀의 가장 가까운 경기" action="전체 일정" onAction={() => setActiveTab('schedule')} />
          <View style={styles.nextWrap}>
            <View style={styles.nextGlow} />
            <View style={styles.nextTop}>
              <LeagueMark leagueId={nextEvent.leagueId} size={34} />
              <View style={styles.nextCompetition}>
                <Text style={styles.nextLabel}>{nextEvent.competition}</Text>
                <Text style={styles.nextStatus}>UP NEXT</Text>
              </View>
            </View>
            <Text style={styles.nextTitle}>{nextEvent.title}</Text>
            <Text style={styles.nextSubtitle}>{nextEvent.subtitle}</Text>
            <View style={styles.nextDivider} />
            <EventCard event={nextEvent} compact />
          </View>
        </View>
      ) : null}

      <View style={styles.section}>
        <SectionHeader title="다가오는 일정" caption={`${events.length}개의 일정이 기다리고 있어요`} action="더 보기" onAction={() => setActiveTab('schedule')} />
        <View style={styles.stack}>
          {events.slice(1, 4).map((event) => <EventCard key={event.id} event={event} compact />)}
          {events.length <= 1 ? <Text style={styles.empty}>표시할 다음 일정이 없습니다.</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="새로운 소식" caption="관심 팀과 리그만 모았습니다" action="모두 보기" onAction={() => setActiveTab('news')} />
        <View style={styles.stack}>
          {news.slice(0, 3).map((item, index) => (
            <NewsCard key={item.id} item={item} featured={index === 0} read={readNewsIds.has(item.id)} onPress={() => markNewsRead(item.id)} />
          ))}
          {news.length === 0 ? <Text style={styles.empty}>새로운 소식이 없습니다.</Text> : null}
        </View>
      </View>

      <View style={styles.demoNotice}>
        <View style={styles.demoDot} />
        <View style={{ flex: 1 }}>
          <Text style={styles.demoTitle}>{connection.status === 'connected' ? 'Supabase 연결됨' : connection.source === 'cache' ? '저장 데이터 표시 중' : '샘플 데이터 표시 중'}</Text>
          <Text style={styles.demoCopy}>{connection.status === 'connected' ? '최신 일정과 소식을 원격 데이터베이스에서 불러왔습니다.' : connection.message ?? 'Supabase 연결을 확인하고 있습니다.'}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  profile: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  profileText: { color: colors.text, fontSize: 12, fontWeight: '900' },
  online: { position: 'absolute', right: -1, bottom: -1, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.mint, borderWidth: 2, borderColor: colors.background },
  followedStrip: { marginHorizontal: 20, marginTop: 20, paddingBottom: 4 },
  followedLabel: { color: colors.textSubtle, fontSize: 9, letterSpacing: 1.7, fontWeight: '900', marginBottom: 9 },
  followedRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  teamPill: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.surface, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 7 },
  teamDot: { width: 7, height: 7, borderRadius: 4 },
  teamName: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  section: { paddingHorizontal: 20, marginTop: 29 },
  stack: { gap: 10 },
  nextWrap: { backgroundColor: colors.surfaceRaised, borderRadius: radii.lg, padding: 17, borderWidth: 1, borderColor: '#315646', overflow: 'hidden' },
  nextGlow: { position: 'absolute', width: 190, height: 190, borderRadius: 100, right: -70, top: -95, backgroundColor: colors.mint, opacity: 0.08 },
  nextTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nextCompetition: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nextLabel: { color: colors.textMuted, fontWeight: '700', fontSize: 12 },
  nextStatus: { color: colors.mint, fontSize: 9, letterSpacing: 1.4, fontWeight: '900' },
  nextTitle: { color: colors.text, fontWeight: '900', fontSize: 23, marginTop: 21, letterSpacing: -0.6 },
  nextSubtitle: { color: colors.textMuted, marginTop: 5, fontSize: 12 },
  nextDivider: { height: 1, backgroundColor: colors.border, marginVertical: 15 },
  empty: { color: colors.textSubtle, textAlign: 'center', paddingVertical: 25, fontSize: 13 },
  demoNotice: { marginHorizontal: 20, marginTop: 28, borderRadius: radii.md, padding: 14, flexDirection: 'row', gap: 10, backgroundColor: '#0D1715', borderWidth: 1, borderColor: '#19352D' },
  demoDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mint, marginTop: 4 },
  demoTitle: { color: colors.text, fontSize: 12, fontWeight: '800' },
  demoCopy: { color: colors.textMuted, fontSize: 11, lineHeight: 17, marginTop: 3 },
});
