/**
 * GET /api/workshops
 * Active workshops, soonest first — straight from Supabase Postgres when
 * configured, demo data when not. One shape, always.
 */
import { getAdmin, isConfigured } from '../../../lib/supabaseAdmin';
import { demoWorkshops } from '../../../lib/demoData';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isConfigured()) {
    return Response.json(demoWorkshops());
  }
  try {
    const admin = getAdmin();
    const { data, error } = await admin
      .from('workshops')
      .select('id, title, description, speaker, role, location, dur, starts_at')
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true });
    if (error) throw error;
    return Response.json(data && data.length ? data : demoWorkshops());
  } catch (e) {
    // DB reachable but unhappy → degrade to demo instead of a dead floor
    return Response.json(demoWorkshops());
  }
}
