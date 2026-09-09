import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { defaultPreferences, mockSnapshot } from '../data/mockData';
import { sportsDataProvider } from '../services/sportsDataProvider';
import { loadCachedUserState, saveCachedUserState } from '../services/localCache';
import { AppDataSnapshot, AppPreferences, LeagueId, MainTabId } from '../types/domain';

interface AppStateValue {
  data: AppDataSnapshot;
  preferences: AppPreferences;
  selectedLeague: LeagueId;
  activeTab: MainTabId;
  readNewsIds: Set<string>;
  refreshing: boolean;
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

  useEffect(() => {
    let active = true;
    loadCachedUserState().then((cached) => {
      if (!active) return;
      if (cached.preferences) {
        setPreferences(cached.preferences);
        setSelectedLeague(cached.preferences.defaultLeague);
      }
      if (cached.readNewsIds) setReadNewsIds(new Set(cached.readNewsIds));
      setCacheReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (cacheReady) void saveCachedUserState(preferences, readNewsIds);
  }, [cacheReady, preferences, readNewsIds]);

  const value = useMemo<AppStateValue>(() => ({
    data,
    preferences,
    selectedLeague,
    activeTab,
    readNewsIds,
    refreshing,
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
    refreshData: async () => {
      setRefreshing(true);
      try {
        setData(await sportsDataProvider.refresh());
      } finally {
        setRefreshing(false);
      }
    },
  }), [activeTab, data, preferences, readNewsIds, refreshing, selectedLeague]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used inside AppStateProvider');
  return context;
}
