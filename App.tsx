import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomNavigation } from './src/components/BottomNavigation';
import { HomeScreen } from './src/screens/HomeScreen';
import { NewsScreen } from './src/screens/NewsScreen';
import { ScheduleScreen } from './src/screens/ScheduleScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { AppStateProvider, useAppState } from './src/state/AppState';
import { colors } from './src/theme';

function AppShell() {
  const { activeTab, setActiveTab } = useAppState();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.screen}>
        {activeTab === 'home' ? <HomeScreen /> : null}
        {activeTab === 'schedule' ? <ScheduleScreen /> : null}
        {activeTab === 'news' ? <NewsScreen /> : null}
        {activeTab === 'settings' ? <SettingsScreen /> : null}
      </View>
      <BottomNavigation value={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
}

export default function App() {
  return <AppStateProvider><AppShell /></AppStateProvider>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1 },
});
