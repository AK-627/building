import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Trim avoids common Vercel/copy-paste issues (trailing newline breaks the Supabase client).
const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseServiceRoleKey as string)
  : null;

/** Use in server actions that must persist data (admin). */
export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.',
    );
  }
  return supabase;
}
