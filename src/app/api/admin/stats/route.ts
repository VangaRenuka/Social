import { requireAuth } from '@/server/auth/session';
import { getStats } from '@/server/db/queries/admin';

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  const stats = await getStats();
  return Response.json(stats, { status: 200 });
}


