
import { requireAuth } from '@/server/auth/session';
import { getUserDetail } from '@/server/db/queries/admin';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user_id = url.pathname.split('/').pop();
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!user_id) return Response.json({ error: 'Missing user_id' }, { status: 400 });
  const user = await getUserDetail(user_id);
  if (!user) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(user, { status: 200 });
}


