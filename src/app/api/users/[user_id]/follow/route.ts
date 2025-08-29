import { requireAuth } from '@/server/auth/session';
import { followUser, unfollowUser } from '@/server/db/queries/social';
import { createNotification } from '@/server/db/queries/notifications';

export async function POST(_req: Request, { params }: { params: { user_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  await followUser(auth.userId, params.user_id);
  if (auth.userId !== params.user_id) {
    await createNotification({ recipient: params.user_id, sender: auth.userId, type: 'follow', message: 'started following you' });
  }
  return Response.json({ success: true }, { status: 200 });
}

export async function DELETE(_req: Request, { params }: { params: { user_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  await unfollowUser(auth.userId, params.user_id);
  return Response.json({ success: true }, { status: 200 });
}


