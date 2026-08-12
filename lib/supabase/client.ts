import { createBrowserClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "@/types/database";

/** Browser Supabase client. Returns null when Supabase is not configured. */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient<Database>(env.supabaseUrl!, env.supabaseAnonKey!);
}
