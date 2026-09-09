import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MainTabId } from '../types/domain';
import { colors } from '../theme';

const tabs: { id: MainTabId; label: string; icon: string }[] = [
  { id: 'home', label: '홈', icon: '⌂' },
  { id: 'schedule', label: '일정', icon: '□' },
  { id: 'news', label: '소식', icon: '≡' },
  { id: 'settings', label: '설정', icon: '⚙' },
];

interface Props { value: MainTabId; onChange: (tab: MainTabId) => void; }

export function BottomNavigation({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <Pressable key={tab.id} onPress={() => onChange(tab.id)} style={({ pressed }) => [styles.item, pressed && styles.pressed]}>
            <Text style={[styles.icon, selected && styles.selected]}>{tab.icon}</Text>
            <Text style={[styles.label, selected && styles.selected]}>{tab.label}</Text>
            {selected ? <View style={styles.indicator} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 75, flexDirection: 'row', backgroundColor: '#0C1118', borderTopWidth: 1, borderTopColor: colors.border, paddingBottom: 8 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  icon: { color: colors.textSubtle, fontSize: 21, lineHeight: 23 },
  label: { color: colors.textSubtle, fontSize: 10, fontWeight: '700' },
  selected: { color: colors.mint },
  indicator: { position: 'absolute', top: 0, width: 24, height: 2, borderRadius: 2, backgroundColor: colors.mint },
  pressed: { opacity: 0.65 },
});

