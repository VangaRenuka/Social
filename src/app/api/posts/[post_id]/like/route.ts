import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { likePost, unlikePost, hasUserLiked } from '@/server/db/queries/engagement';
import { createNotification } from '@/server/db/queries/notifications';
import { getPostById } from '@/server/db/queries/posts';

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const post_id = url.pathname.split('/').pop();
  if (!post_id) return Response.json({ error: 'Missing post_id' }, { status: 400 });
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  await likePost(auth.userId, post_id);
  const post = await getPostById(post_id);
  if (post && post.author_id !== auth.userId) {
    await createNotification({ recipient: post.author_id, sender: auth.userId, type: 'like', post_id, message: 'liked your post' });
  }
  return Response.json({ success: true }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const post_id = url.pathname.split('/').pop();
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  if (!post_id) return Response.json({ error: 'Missing post_id' }, { status: 400 });
  await unlikePost(auth.userId, post_id);
  return Response.json({ success: true }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const post_id = url.pathname.split('/').pop();
  if (!post_id) return Response.json({ error: 'Missing post_id' }, { status: 400 });
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const liked = await hasUserLiked(auth.userId, post_id);
  return Response.json({ liked }, { status: 200 });
}


