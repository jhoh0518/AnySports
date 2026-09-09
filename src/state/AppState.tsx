import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { defaultPreferences, mockSnapshot } from '../data/mockData';
import { sportsDataProvider } from '../services/sportsDataProvider';
import { DataProviderError } from '../services/sportsDataProvider';
import { loadCachedSnapshot, loadCachedUserState, saveCachedSnapshot, saveCachedUserState } from '../services/localCache';
import { AppDataSnapshot, AppPreferences, LeagueId, MainTabId } from '../types/domain';

interface AppStateValue {
  data: AppDataSnapshot;
  preferences: AppPreferences;
  selectedLeague: LeagueId;
  activeTab: MainTabId;
  readNewsIds: Set<string>;
  refreshing: boolean;
  dataSource: 'connecting' | 'supabase' | 'cache' | 'sample' | 'schema_missing' | 'configuration_error' | 'error';
  dataSourceMessage: string;
  lastSyncAt?: string;
  setSelectedLeague: (league: LeagueId) => void;
  setActiveTab: (tab: MainTabId) => void;
  updatePreferences: (patch: Partial<AppPreferences>) => void;
  toggleFollow: (entityId: string) => void;
  markNewsRead: (newsId: string) => void;
  refreshData: () => Promise<void>;
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
  const [dataSource, setDataSource] = useState<AppStateValue['dataSource']>('connecting');
  const [dataSourceMessage, setDataSourceMessage] = useState('Supabase 연결을 확인하고 있습니다.');
  const [lastSyncAt, setLastSyncAt] = useState<string>();

  useEffect(() => {
    let active = true;
    Promise.all([loadCachedUserState(), loadCachedSnapshot()]).then(([cached, cachedData]) => {
      if (!active) return;
      if (cached.preferences) {
        setPreferences(cached.preferences);
        setSelectedLeague(cached.preferences.defaultLeague);
      }
      if (cached.readNewsIds) setReadNewsIds(new Set(cached.readNewsIds));
      if (cachedData.snapshot) {
        setData(cachedData.snapshot);
        setLastSyncAt(cachedData.savedAt);
        setDataSource('cache');
        setDataSourceMessage('저장된 최근 데이터를 표시하고 있습니다.');
      }
      setCacheReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (cacheReady) void saveCachedUserState(preferences, readNewsIds);
  }, [cacheReady, preferences, readNewsIds]);

  useEffect(() => {
    void refreshData();
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const snapshot = await sportsDataProvider.refresh();
      const syncedAt = new Date().toISOString();
      setData(snapshot);
      setDataSource('supabase');
      setDataSourceMessage('Supabase 최신 데이터를 사용 중입니다.');
      setLastSyncAt(syncedAt);
      await saveCachedSnapshot(snapshot, syncedAt);
    } catch (error) {
      if (error instanceof DataProviderError) {
        if (error.code === 'schema_missing') setDataSource('schema_missing');
        else if (error.code === 'not_configured') setDataSource('configuration_error');
        else setDataSource('error');
        setDataSourceMessage(error.message);
      } else {
        setDataSource('error');
        setDataSourceMessage('데이터를 불러오지 못해 로컬 데이터를 표시합니다.');
      }
    } finally {
      setRefreshing(false);
    }
  };

  const value = useMemo<AppStateValue>(() => ({
    data,
    preferences,
    selectedLeague,
    activeTab,
    readNewsIds,
    refreshing,
    dataSource,
    dataSourceMessage,
    lastSyncAt,
    setSelectedLeague,
    setActiveTab,
    updatePreferences: (patch) => setPreferences((current) => ({ ...current, ...patch })),
    toggleFollow: (entityId) => setPreferences((current) => ({
      ...current,
      followedEntityIds: current.followedEntityIds.includes(entityId)
        ? current.followedEntityIds.filter((id) => id !== entityId)
        : [...current.followedEntityIds, entityId],
    })),
    markNewsRead: (newsId) => setReadNewsIds((current) => new Set([...current, newsId])),
    refreshData,
  }), [activeTab, data, dataSource, dataSourceMessage, lastSyncAt, preferences, readNewsIds, refreshing, selectedLeague]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}
