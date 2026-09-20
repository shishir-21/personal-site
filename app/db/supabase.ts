// app/db/supabase.ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client for the visitor counter. Uses the service_role
// key, which bypasses RLS — this MUST never be imported by a client component
// (the `server-only` import above turns any such import into a build error).
//
// Returns null when env vars are absent (local dev without credentials, or a
// misconfigured deploy). Callers treat null as "counter off" and fail soft.
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
