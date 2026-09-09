import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppPreferences } from '../types/domain';

const PREFERENCES_KEY = '@anysports/preferences/v1';
const READ_NEWS_KEY = '@anysports/read-news/v1';

export interface CachedUserState {
  preferences?: AppPreferences;
  readNewsIds?: string[];
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

