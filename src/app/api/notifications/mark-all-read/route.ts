import { requireAuth } from '@/server/auth/session';
import { markAllRead } from '@/server/db/queries/notifications';

export async function POST() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  await markAllRead(auth.userId);
  return Response.json({ success: true }, { status: 200 });
}


