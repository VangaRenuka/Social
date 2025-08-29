import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { getFeedForUser } from '@/server/db/queries/feed';

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;
  const feed = await getFeedForUser(auth.userId, limit, offset);
  return Response.json({ results: feed, page }, { status: 200 });
}


