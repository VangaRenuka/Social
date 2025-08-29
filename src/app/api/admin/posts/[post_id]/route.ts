import { requireAuth } from '@/server/auth/session';
import { deleteAnyPost } from '@/server/db/queries/admin';

export async function DELETE(_req: Request, { params }: { params: { post_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  await deleteAnyPost(params.post_id);
  return Response.json({ success: true }, { status: 200 });
}


