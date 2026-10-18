import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client for use in Server Components and Server Actions.
 * This is a singleton pattern — safe to import in any server-side code.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
