/**
 * GET /api/config
 * Public, non-secret: tells the browser whether Supabase Auth is wired, and
 * hands over the PUBLIC anon credentials (safe for the browser by design —
 * real protection comes from RLS). Never returns the service-role key.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || null;
  const supabaseAnonKey = supabaseUrl ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null : null;
  return Response.json({
    supabaseUrl,
    supabaseAnonKey,
    authEnabled: Boolean(supabaseUrl && supabaseAnonKey),
  });
}
