import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

interface Props {
  title: string;
  caption?: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, caption, action, onAction }: Props) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      </View>
      {action ? <Pressable onPress={onAction}><Text style={styles.action}>{action}</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 12 },
  title: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  caption: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  action: { color: colors.mint, fontWeight: '700', fontSize: 13, paddingVertical: 4 },
});

