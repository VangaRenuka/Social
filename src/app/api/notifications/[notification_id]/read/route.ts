
import { requireAuth } from '@/server/auth/session';
import { markRead } from '@/server/db/queries/notifications';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const notification_id = url.pathname.split('/').pop();
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (!notification_id) return Response.json({ error: 'Missing notification_id' }, { status: 400 });
  await markRead(notification_id, auth.userId);
  return Response.json({ success: true }, { status: 200 });
}


