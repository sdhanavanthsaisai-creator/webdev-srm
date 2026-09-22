/**
 * POST /api/register   { workshop_id }
 * Inserts into `registrations` (unique (user_id, workshop_id) → 409 on dupe).
 * Auth: Supabase access token in the Authorization header (RLS enforces the
 * same rule at the database level — this is defense in depth).
 *
 * Responses (one shape, always):
 *   200 { registered: true }     400 { error }   401 { error }
 *   404 { error }                409 { error: "already registered" }
 */
import { getAdmin, isConfigured } from '../../../lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let body: { workshop_id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 });
  }
  const workshopId = body.workshop_id;
  if (!workshopId) {
    return Response.json({ error: 'workshop_id is required' }, { status: 400 });
  }
  if (!isConfigured()) {
    return Response.json({ error: 'Supabase not configured — running in demo mode' }, { status: 503 });
  }

  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return Response.json({ error: 'unauthenticated' }, { status: 401 });
  }

  const admin = getAdmin();
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return Response.json({ error: 'unauthenticated' }, { status: 401 });
  }
  const userId = userData.user.id;

  const { data: workshop } = await admin
    .from('workshops')
    .select('id')
    .eq('id', workshopId)
    .maybeSingle();
  if (!workshop) {
    return Response.json({ error: 'workshop not found' }, { status: 404 });
  }

  const { error: insertErr } = await admin
    .from('registrations')
    .insert({ user_id: userId, workshop_id: workshopId });

  if (insertErr) {
    const code = (insertErr as { code?: string }).code;
    if (code === '23505') {
      return Response.json({ error: 'already registered' }, { status: 409 });
    }
    return Response.json({ error: 'database error' }, { status: 500 });
  }
  return Response.json({ registered: true });
}
