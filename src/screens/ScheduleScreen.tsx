import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { EventCard } from '../components/EventCard';
import { LeagueFilter } from '../components/LeagueFilter';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppState } from '../state/AppState';
import { colors, radii } from '../theme';
import { matchesLeague } from '../utils/format';
import { isVisibleForFollowing } from '../utils/visibility';

const days = [
  { day: '오늘', date: '9', active: true },
  { day: '목', date: '10' }, { day: '금', date: '11' }, { day: '토', date: '12', event: true },
  { day: '일', date: '13', event: true }, { day: '월', date: '14' }, { day: '화', date: '15', event: true },
];

export function ScheduleScreen() {
  const { data, preferences, selectedLeague, setSelectedLeague } = useAppState();
  const followed = new Set(preferences.followedEntityIds);
  const events = data.events
    .filter((event) => isVisibleForFollowing(event, followed, data.entities))
    .filter((event) => matchesLeague(event, selectedLeague))
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ScreenHeader eyebrow="CALENDAR" title="경기 일정" trailing={<View style={styles.month}><Text style={styles.monthText}>2026. 09</Text></View>} />
      <LeagueFilter value={selectedLeague} onChange={setSelectedLeague} />

      <View style={styles.calendarCard}>
        <View style={styles.weekRow}>
          {days.map((item) => (
            <View key={item.date} style={[styles.day, item.active && styles.dayActive]}>
              <Text style={[styles.dayName, item.active && styles.dayTextActive]}>{item.day}</Text>
              <Text style={[styles.dayDate, item.active && styles.dayTextActive]}>{item.date}</Text>
              {item.event ? <View style={[styles.eventDot, item.active && styles.eventDotActive]} /> : null}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryTitle}>예정된 일정</Text>
          <Text style={styles.summaryCaption}>선택한 관심 팀 기준</Text>
        </View>
        <View style={styles.count}><Text style={styles.countText}>{events.length}</Text></View>
      </View>

      <View style={styles.stack}>
        {events.map((event) => <EventCard key={event.id} event={event} />)}
        {events.length === 0 ? <Text style={styles.empty}>선택한 리그의 일정이 없습니다.</Text> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  month: { borderRadius: radii.pill, paddingHorizontal: 11, paddingVertical: 7, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  monthText: { color: colors.textMuted, fontSize: 11, fontWeight: '800' },
  calendarCard: { margin: 20, backgroundColor: colors.surface, padding: 10, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { width: 38, height: 62, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  dayActive: { backgroundColor: colors.mint },
  dayName: { color: colors.textSubtle, fontSize: 9, fontWeight: '700' },
  dayDate: { color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 5 },
  dayTextActive: { color: '#07120E' },
  eventDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.mint, marginTop: 4 },
  eventDotActive: { backgroundColor: '#07120E' },
  summaryRow: { marginHorizontal: 20, marginTop: 4, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTitle: { color: colors.text, fontSize: 20, fontWeight: '900' },
  summaryCaption: { color: colors.textMuted, fontSize: 11, marginTop: 3 },
  count: { width: 31, height: 31, borderRadius: 11, backgroundColor: colors.mintSoft, alignItems: 'center', justifyContent: 'center' },
  countText: { color: colors.mint, fontWeight: '900' },
  stack: { marginHorizontal: 20, gap: 10 },
  empty: { color: colors.textMuted, paddingVertical: 40, textAlign: 'center' },
});
