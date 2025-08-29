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

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const user_id = url.pathname.split('/').pop();
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (!user_id) return Response.json({ error: 'Missing user_id' }, { status: 400 });
  await unfollowUser(auth.userId, user_id);
  return Response.json({ success: true }, { status: 200 });
}


