import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { listAllUsers } from '@/server/db/queries/admin';

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = 50;
  const offset = (page - 1) * limit;
  const users = await listAllUsers(limit, offset);
  return Response.json({ results: users, page }, { status: 200 });
}


