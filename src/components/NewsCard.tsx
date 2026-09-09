import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NewsItem } from '../types/domain';
import { colors, radii } from '../theme';
import { formatRelativeTime } from '../utils/format';
import { LeagueMark } from './LeagueMark';

interface Props { item: NewsItem; read?: boolean; featured?: boolean; onPress?: () => void; }

export function NewsCard({ item, read = false, featured = false, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, featured && styles.featured, read && styles.read, pressed && styles.pressed]}>
      {featured ? <View style={[styles.heroAccent, { backgroundColor: item.accent }]} /> : null}
      <View style={styles.metaRow}>
        <View style={styles.sourceRow}>
          <LeagueMark leagueId={item.leagueId} size={23} />
          <Text style={styles.source}>{item.source}</Text>
          {!read ? <View style={styles.unread} /> : null}
        </View>
        <Text style={styles.time}>{formatRelativeTime(item.publishedAt)}</Text>
      </View>
      <Text style={[styles.title, featured && styles.featuredTitle]}>{item.title}</Text>
      <Text numberOfLines={featured ? 3 : 2} style={styles.summary}>{item.summary}</Text>
      <View style={styles.footer}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: radii.md, padding: 15, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  featured: { minHeight: 190, justifyContent: 'flex-end', paddingTop: 48, backgroundColor: colors.surfaceRaised },
  heroAccent: { position: 'absolute', top: -55, right: -35, width: 165, height: 165, borderRadius: 90, opacity: 0.22 },
  read: { opacity: 0.72 },
  pressed: { opacity: 0.76 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  sourceRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  source: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  unread: { width: 6, height: 6, backgroundColor: colors.mint, borderRadius: 3 },
  time: { color: colors.textSubtle, fontSize: 10 },
  title: { color: colors.text, fontSize: 16, lineHeight: 22, fontWeight: '800', letterSpacing: -0.3 },
  featuredTitle: { fontSize: 21, lineHeight: 28 },
  summary: { color: colors.textMuted, fontSize: 12, lineHeight: 19, marginTop: 7 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  category: { color: colors.mint, fontSize: 10, fontWeight: '800' },
  chevron: { color: colors.textSubtle, fontSize: 22 },
});

