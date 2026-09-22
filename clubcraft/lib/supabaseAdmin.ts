/**
 * Supabase admin client (server-side only).
 * Returns null when env vars are absent → routes fall back to demo data
 * instead of crashing. The service-role key is NEVER exposed to the browser.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let admin: SupabaseClient | null = null;
if (url && serviceKey) {
  admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function getAdmin(): SupabaseClient {
  if (!admin) throw new Error('Supabase not configured');
  return admin;
}

export function isConfigured(): boolean {
  return admin !== null;
}
