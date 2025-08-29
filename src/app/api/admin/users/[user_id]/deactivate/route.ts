
import { requireAuth } from '@/server/auth/session';
import { deactivateUser } from '@/server/db/queries/admin';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const user_id = url.pathname.split('/').pop();
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!user_id) return Response.json({ error: 'Missing user_id' }, { status: 400 });
  await deactivateUser(user_id);
  return Response.json({ success: true }, { status: 200 });
}


