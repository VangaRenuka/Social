import { requireAuth } from '@/server/auth/session';
import { markRead } from '@/server/db/queries/notifications';

export async function POST(_req: Request, { params }: { params: { notification_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  await markRead(params.notification_id, auth.userId);
  return Response.json({ success: true }, { status: 200 });
}


