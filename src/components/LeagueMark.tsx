import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ContentLeagueId } from '../types/domain';
import { colors } from '../theme';

interface Props {
  leagueId: ContentLeagueId;
  size?: number;
  selected?: boolean;
}

export function LeagueMark({ leagueId, size = 34, selected = false }: Props) {
  if (leagueId === 'epl') {
    return (
      <View accessibilityLabel="프리미어리그" style={[styles.base, styles.epl, { width: size, height: size, borderRadius: size / 2 }, selected && styles.selected]}>
        <View style={[styles.crown, { top: size * 0.13 }]} />
        <Text style={[styles.ball, { fontSize: size * 0.43 }]}>●</Text>
      </View>
    );
  }

  if (leagueId === 'lck') {
    return (
      <View accessibilityLabel="LCK" style={[styles.base, styles.lck, { width: size, height: size, borderRadius: size / 2 }, selected && styles.selected]}>
        <View style={[styles.lckWing, styles.lckWingLeft, { width: size * 0.24, height: size * 0.44 }]} />
        <View style={[styles.lckWing, styles.lckWingRight, { width: size * 0.24, height: size * 0.44 }]} />
      </View>
    );
  }

  return (
    <View accessibilityLabel="Formula 1" style={[styles.base, styles.f1, { width: size, height: size, borderRadius: size / 2 }, selected && styles.selected]}>
      <View style={[styles.speedLine, { width: size * 0.48, top: size * 0.34 }]} />
      <View style={[styles.speedLine, { width: size * 0.34, top: size * 0.51 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  selected: { borderColor: colors.mint },
  epl: { backgroundColor: '#5B3BCD' },
  lck: { backgroundColor: '#E8EDF2' },
  f1: { backgroundColor: '#271318' },
  crown: { position: 'absolute', width: '35%', height: 4, backgroundColor: '#FFFFFF', transform: [{ rotate: '-10deg' }] },
  ball: { color: '#FFFFFF', lineHeight: undefined },
  lckWing: { position: 'absolute', backgroundColor: '#11151D', transform: [{ skewX: '-18deg' }] },
  lckWingLeft: { left: '24%' },
  lckWingRight: { right: '24%', transform: [{ skewX: '18deg' }] },
  speedLine: { position: 'absolute', height: 4, right: '20%', backgroundColor: '#FF233B', borderRadius: 3, transform: [{ skewX: '-22deg' }] },
});

