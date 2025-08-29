import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { likePost, unlikePost, hasUserLiked } from '@/server/db/queries/engagement';
import { createNotification } from '@/server/db/queries/notifications';
import { getPostById } from '@/server/db/queries/posts';

export async function POST(_req: NextRequest, { params }: { params: { post_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  await likePost(auth.userId, params.post_id);
  const post = await getPostById(params.post_id);
  if (post && post.author_id !== auth.userId) {
    await createNotification({ recipient: post.author_id, sender: auth.userId, type: 'like', post_id: params.post_id, message: 'liked your post' });
  }
  return Response.json({ success: true }, { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: { params: { post_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  await unlikePost(auth.userId, params.post_id);
  return Response.json({ success: true }, { status: 200 });
}

export async function GET(_req: NextRequest, { params }: { params: { post_id: string } }) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const liked = await hasUserLiked(auth.userId, params.post_id);
  return Response.json({ liked }, { status: 200 });
}


