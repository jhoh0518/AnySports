import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { defaultPreferences, mockSnapshot } from '../data/mockData';
import { loadCachedDataSnapshot, loadCachedUserState, saveCachedDataSnapshot, saveCachedUserState } from '../services/localCache';
import { sportsDataProvider, SportsDataError } from '../services/sportsDataProvider';
import { AppDataSnapshot, AppPreferences, DataConnectionState, LeagueId, MainTabId } from '../types/domain';

interface AppStateValue {
  data: AppDataSnapshot; preferences: AppPreferences; selectedLeague: LeagueId; activeTab: MainTabId;
  readNewsIds: Set<string>; refreshing: boolean; connection: DataConnectionState;
  setSelectedLeague: (league: LeagueId) => void; setActiveTab: (tab: MainTabId) => void;
  updatePreferences: (patch: Partial<AppPreferences>) => void; toggleFollow: (id: string) => void;
  markNewsRead: (id: string) => void; refreshData: () => Promise<void>;
}
const AppStateContext = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState(mockSnapshot);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>(defaultPreferences.defaultLeague);
  const [activeTab, setActiveTab] = useState<MainTabId>('home');
  const [readNewsIds, setReadNewsIds] = useState<Set<string>>(new Set(['news-dk-playoffs']));
  const [refreshing, setRefreshing] = useState(false);
  const [cacheReady, setCacheReady] = useState(false);
  const [connection, setConnection] = useState<DataConnectionState>({ status: 'checking', source: 'sample' });

  const refreshData = async () => {
    setRefreshing(true); setConnection((current) => ({ ...current, status: 'checking' }));
    try {
      const remote = await sportsDataProvider.refresh();
      const syncedAt = new Date().toISOString();
      setData(remote); setConnection({ status: 'connected', source: 'supabase', lastSyncedAt: syncedAt });
      await saveCachedDataSnapshot(remote, syncedAt);
    } catch (error) {
      setConnection((current) => ({ ...current, status: error instanceof SportsDataError ? error.status : 'unknown-error', message: error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.' }));
    } finally { setRefreshing(false); }
  };

  useEffect(() => {
    let active = true;
    Promise.all([loadCachedUserState(), loadCachedDataSnapshot()]).then(([user, cached]) => {
      if (!active) return;
      if (user.preferences) { setPreferences(user.preferences); setSelectedLeague(user.preferences.defaultLeague); }
      if (user.readNewsIds) setReadNewsIds(new Set(user.readNewsIds));
      if (cached) { setData(cached.data); setConnection({ status: 'checking', source: 'cache', lastSyncedAt: cached.syncedAt }); }
      setCacheReady(true); void refreshData();
    });
    return () => { active = false; };
  }, []);
  useEffect(() => { if (cacheReady) void saveCachedUserState(preferences, readNewsIds); }, [cacheReady, preferences, readNewsIds]);

  const value = useMemo<AppStateValue>(() => ({
    data, preferences, selectedLeague, activeTab, readNewsIds, refreshing, connection,
    setSelectedLeague, setActiveTab,
    updatePreferences: (patch) => setPreferences((current) => ({ ...current, ...patch })),
    toggleFollow: (id) => setPreferences((current) => ({ ...current, followedEntityIds: current.followedEntityIds.includes(id) ? current.followedEntityIds.filter((item) => item !== id) : [...current.followedEntityIds, id] })),
    markNewsRead: (id) => setReadNewsIds((current) => new Set([...current, id])), refreshData,
  }), [activeTab, connection, data, preferences, readNewsIds, refreshing, selectedLeague]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
export function useAppState(): AppStateValue {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}
