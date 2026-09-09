import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  icon: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  trailing?: string;
}

export function SettingsRow({ title, subtitle, icon, value, onValueChange, onPress, trailing }: Props) {
  const toggle = typeof value === 'boolean' && onValueChange;
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconBox}><Text style={styles.icon}>{icon}</Text></View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {toggle ? <Switch value={value} onValueChange={onValueChange} trackColor={{ false: colors.surfaceSoft, true: colors.mintSoft }} thumbColor={value ? colors.mint : colors.textSubtle} /> : null}
      {!toggle ? <Text style={styles.trailing}>{trailing ?? '›'}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 67, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  pressed: { opacity: 0.68 },
  iconBox: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.surfaceSoft, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  icon: { color: colors.mint, fontSize: 16 },
  copy: { flex: 1, paddingVertical: 10 },
  title: { color: colors.text, fontSize: 14, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: 10, lineHeight: 15, marginTop: 3 },
  trailing: { color: colors.textSubtle, fontSize: 20, marginLeft: 8 },
});
