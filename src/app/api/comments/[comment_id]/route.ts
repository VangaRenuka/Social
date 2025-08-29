import { requireAuth } from '@/server/auth/session';
import { deleteOwnComment } from '@/server/db/queries/engagement';

export async function DELETE(_req: Request, { params }: { params: { comment_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  await deleteOwnComment(auth.userId, params.comment_id);
  return Response.json({ success: true }, { status: 200 });
}


