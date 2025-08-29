import { requireAuth } from '@/server/auth/session';
import { getUserDetail } from '@/server/db/queries/admin';

export async function GET(_req: Request, { params }: { params: { user_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  const user = await getUserDetail(params.user_id);
  if (!user) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(user, { status: 200 });
}


