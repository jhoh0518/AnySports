import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface Props { eyebrow?: string; title: string; trailing?: React.ReactNode; }

export function ScreenHeader({ eyebrow, title, trailing }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
      </View>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  copy: { flex: 1 },
  eyebrow: { color: colors.mint, fontSize: 11, fontWeight: '800', letterSpacing: 1.7, textTransform: 'uppercase', marginBottom: 6 },
  title: { color: colors.text, fontSize: 28, fontWeight: '900', letterSpacing: -1 },
});

