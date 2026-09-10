import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
export const hasSupabaseConfiguration = Boolean(url && key);
export const supabase: SupabaseClient | null = hasSupabaseConfiguration
  ? createClient(url!, key!, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
  : null;
