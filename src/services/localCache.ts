import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDataSnapshot, AppPreferences } from '../types/domain';

const PREFERENCES_KEY = '@anysports/preferences/v1';
const READ_NEWS_KEY = '@anysports/read-news/v1';
const SNAPSHOT_KEY = '@anysports/data-snapshot/v1';
const SNAPSHOT_TIME_KEY = '@anysports/data-snapshot-time/v1';

export interface CachedUserState {
  preferences?: AppPreferences;
  readNewsIds?: string[];
}

export interface CachedSnapshot {
  snapshot?: AppDataSnapshot;
  savedAt?: string;
}

export async function loadCachedUserState(): Promise<CachedUserState> {
  try {
    const [preferencesValue, readNewsValue] = await Promise.all([
      AsyncStorage.getItem(PREFERENCES_KEY),
      AsyncStorage.getItem(READ_NEWS_KEY),
    ]);
    return {
      preferences: preferencesValue ? JSON.parse(preferencesValue) as AppPreferences : undefined,
      readNewsIds: readNewsValue ? JSON.parse(readNewsValue) as string[] : undefined,
    };
  } catch {
    return {};
  }
}

export async function loadCachedSnapshot(): Promise<CachedSnapshot> {
  try {
    const [snapshotValue, savedAt] = await Promise.all([
      AsyncStorage.getItem(SNAPSHOT_KEY),
      AsyncStorage.getItem(SNAPSHOT_TIME_KEY),
    ]);
    return {
      snapshot: snapshotValue ? JSON.parse(snapshotValue) as AppDataSnapshot : undefined,
      savedAt: savedAt ?? undefined,
    };
  } catch {
    return {};
  }
}

export async function saveCachedSnapshot(snapshot: AppDataSnapshot, savedAt: string): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot)),
      AsyncStorage.setItem(SNAPSHOT_TIME_KEY, savedAt),
    ]);
  } catch {
    // The network response remains usable even when persistent cache is unavailable.
  }
}

export async function saveCachedUserState(preferences: AppPreferences, readNewsIds: Set<string>): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences)),
      AsyncStorage.setItem(READ_NEWS_KEY, JSON.stringify([...readNewsIds])),
    ]);
  } catch {
    // A cache failure must never prevent the sports feed from opening.
  }
}
