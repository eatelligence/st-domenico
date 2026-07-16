import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// No cookies — safe to call inside unstable_cache. RLS anon policy applies (active rows only).
export function createAnonClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  )
}
