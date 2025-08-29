
import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { getPostById, updatePost, deletePost } from '@/server/db/queries/posts';
import { z } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { post_id: string } }) {
  const post = await getPostById(params.post_id);
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(post, { status: 200 });
}

export async function PUT(req: NextRequest, { params }: { params: { post_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const schema = z.object({ content: z.string().max(280).optional(), category: z.enum(['general','announcement','question']).optional(), is_active: z.boolean().optional(), image_url: z.string().url().nullable().optional() });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  const updated = await updatePost(params.post_id, auth.userId, parsed.data as Record<string, unknown>);
  return Response.json(updated, { status: 200 });
}

export const PATCH = PUT;

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const post_id = url.pathname.split('/').pop();
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (!post_id) return Response.json({ error: 'Missing post_id' }, { status: 400 });
  await deletePost(post_id, auth.userId);
  return Response.json({ success: true }, { status: 200 });
}


