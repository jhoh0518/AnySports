import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDataSnapshot, AppPreferences } from '../types/domain';

const PREFERENCES_KEY = '@anysports/preferences/v1';
const READ_NEWS_KEY = '@anysports/read-news/v1';
const DATA_SNAPSHOT_KEY = '@anysports/data-snapshot/v1';

export interface CachedUserState {
  preferences?: AppPreferences;
  readNewsIds?: string[];
}

export interface CachedDataSnapshot { data: AppDataSnapshot; syncedAt: string }

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

export async function loadCachedDataSnapshot(): Promise<CachedDataSnapshot | null> {
  try {
    const value = await AsyncStorage.getItem(DATA_SNAPSHOT_KEY);
    return value ? JSON.parse(value) as CachedDataSnapshot : null;
  } catch { return null; }
}

export async function saveCachedDataSnapshot(data: AppDataSnapshot, syncedAt: string): Promise<void> {
  try { await AsyncStorage.setItem(DATA_SNAPSHOT_KEY, JSON.stringify({ data, syncedAt })); }
  catch { /* Keep a successful remote response visible even if caching fails. */ }
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
