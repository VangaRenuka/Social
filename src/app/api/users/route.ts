import { NextRequest } from 'next/server';
import { listUsersBasic } from '@/server/db/queries/profiles';
import { requireAuth } from '@/server/auth/session';

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || undefined;
  const page = Number(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;
  const users = await listUsersBasic(q, limit, offset);
  return Response.json({ results: users, page }, { status: 200 });
}


