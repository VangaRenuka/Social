import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { listNotifications } from '@/server/db/queries/notifications';

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;
  const items = await listNotifications(auth.userId, limit, offset);
  return Response.json({ results: items, page }, { status: 200 });
}


