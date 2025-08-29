import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { addComment, listComments } from '@/server/db/queries/engagement';
import { z } from 'zod';
import { createNotification } from '@/server/db/queries/notifications';
import { getPostById } from '@/server/db/queries/posts';


export async function GET(_req: NextRequest, context: { params: { post_id: string } }) {
  const { post_id } = context.params;
  const page = 1; // simple default
  const limit = 50;
  const offset = (page - 1) * limit;
  const comments = await listComments(post_id, limit, offset);
  return Response.json({ results: comments }, { status: 200 });
}

export async function POST(req: NextRequest, context: { params: { post_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const schema = z.object({ content: z.string().max(200) });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  const created = await addComment(auth.userId, context.params.post_id, parsed.data.content);
  const post = await getPostById(context.params.post_id);
  if (post && post.author_id !== auth.userId) {
    await createNotification({ recipient: post.author_id, sender: auth.userId, type: 'comment', post_id: context.params.post_id, message: 'commented on your post' });
  }
  return Response.json(created, { status: 201 });
}


