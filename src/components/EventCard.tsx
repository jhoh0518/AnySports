import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SportsEvent } from '../types/domain';
import { colors, radii } from '../theme';
import { formatEventDate, formatEventTime } from '../utils/format';
import { LeagueMark } from './LeagueMark';

interface Props { event: SportsEvent; compact?: boolean; onPress?: () => void; }

export function EventCard({ event, compact = false, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}>
      <View style={styles.topline}>
        <View style={styles.competitionRow}>
          <LeagueMark leagueId={event.leagueId} size={24} />
          <Text style={styles.competition}>{event.competition}</Text>
        </View>
        {event.isInternational ? <Text style={styles.international}>국제전</Text> : null}
      </View>
      <View style={styles.mainRow}>
        <View style={styles.dateBox}>
          <Text style={styles.time}>{formatEventTime(event.startsAt)}</Text>
          <Text style={styles.date}>{formatEventDate(event.startsAt)}</Text>
        </View>
        <View style={styles.rule} />
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.title}>{event.title}</Text>
          <Text numberOfLines={1} style={styles.subtitle}>{event.subtitle}</Text>
          {event.venue ? <Text numberOfLines={1} style={styles.venue}>⌖ {event.venue}</Text> : null}
        </View>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: 15, borderWidth: 1, borderColor: colors.border, gap: 13 },
  compact: { paddingVertical: 13 },
  pressed: { opacity: 0.78 },
  topline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  competitionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  competition: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  international: { color: colors.mint, backgroundColor: colors.mintSoft, overflow: 'hidden', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4, fontSize: 10, fontWeight: '800' },
  mainRow: { flexDirection: 'row', alignItems: 'center' },
  dateBox: { width: 73 },
  time: { color: colors.text, fontSize: 19, fontWeight: '900', letterSpacing: -0.5 },
  date: { color: colors.textMuted, fontSize: 10, marginTop: 3 },
  rule: { width: 1, height: 42, backgroundColor: colors.border, marginRight: 14 },
  copy: { flex: 1 },
  title: { color: colors.text, fontWeight: '800', fontSize: 15, letterSpacing: -0.2 },
  subtitle: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  venue: { color: colors.textSubtle, fontSize: 10, marginTop: 5 },
  chevron: { color: colors.textSubtle, fontSize: 25, marginLeft: 8 },
});

