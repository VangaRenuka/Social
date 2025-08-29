import { requireAuth } from '@/server/auth/session';
import { deactivateUser } from '@/server/db/queries/admin';

export async function POST(_req: Request, { params }: { params: { user_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  await deactivateUser(params.user_id);
  return Response.json({ success: true }, { status: 200 });
}


