import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LeagueId } from '../types/domain';
import { colors } from '../theme';
import { LeagueMark } from './LeagueMark';

interface Props {
  value: LeagueId;
  unreadByLeague?: Partial<Record<LeagueId, boolean>>;
  onChange: (league: LeagueId) => void;
}

const leagues: LeagueId[] = ['all', 'epl', 'lck', 'f1'];

export function LeagueFilter({ value, unreadByLeague = {}, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {leagues.map((league) => {
        const selected = league === value;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={league === 'all' ? '전체' : league}
            key={league}
            onPress={() => onChange(league)}
            style={({ pressed }) => [styles.item, selected && styles.itemSelected, pressed && styles.pressed]}
          >
            {league === 'all' ? (
              <Text style={[styles.allText, selected && styles.allTextSelected]}>전체</Text>
            ) : (
              <LeagueMark leagueId={league} size={38} selected={selected} />
            )}
            {unreadByLeague[league] && <View style={styles.dot} />}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 20, gap: 10, alignItems: 'center' },
  item: { minWidth: 54, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  itemSelected: { borderColor: colors.mint, backgroundColor: colors.surfaceRaised },
  allText: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
  allTextSelected: { color: colors.mint },
  dot: { position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: 4, backgroundColor: colors.mint, borderWidth: 1, borderColor: colors.background },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
});

