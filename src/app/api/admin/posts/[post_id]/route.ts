

import { requireAuth } from '@/server/auth/session';
import { deleteAnyPost } from '@/server/db/queries/admin';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const post_id = url.pathname.split('/').pop();
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (auth.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (!post_id) return Response.json({ error: 'Missing post_id' }, { status: 400 });
  await deleteAnyPost(post_id);
  return Response.json({ success: true }, { status: 200 });
}


