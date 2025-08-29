import { requireAuth } from '@/server/auth/session';
import { deleteOwnComment } from '@/server/db/queries/engagement';

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const comment_id = url.pathname.split('/').pop();
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (!comment_id) return Response.json({ error: 'Missing comment_id' }, { status: 400 });
  await deleteOwnComment(auth.userId, comment_id);
  return Response.json({ success: true }, { status: 200 });
}


