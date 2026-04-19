import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseServiceRoleKey);

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseServiceRoleKey as string)
  : null;
