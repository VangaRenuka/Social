import { supabaseAdmin } from '@/lib/supabaseClient';

export async function likePost(userId: string, postId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('likes').insert({ user_id: userId, post_id: postId });
  if (error && error.code !== '23505') throw error; // ignore duplicate
  await supa.rpc('increment_like_count', { p_post_id: postId }).catch(() => {});
}

export async function unlikePost(userId: string, postId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('likes').delete().eq('user_id', userId).eq('post_id', postId);
  if (error) throw error;
  await supa.rpc('decrement_like_count', { p_post_id: postId }).catch(() => {});
}

export async function hasUserLiked(userId: string, postId: string) {
  const supa = supabaseAdmin();
  const { data, error } = await supa.from('likes').select('user_id').eq('user_id', userId).eq('post_id', postId).maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function addComment(userId: string, postId: string, content: string) {
  const supa = supabaseAdmin();
  const { data, error } = await supa.from('comments').insert({ author_id: userId, post_id: postId, content }).select('*').single();
  if (error) throw error;
  await supa.rpc('increment_comment_count', { p_post_id: postId }).catch(() => {});
  return data;
}

export async function listComments(postId: string, limit = 20, offset = 0) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function deleteOwnComment(userId: string, commentId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('comments').delete().eq('id', commentId).eq('author_id', userId);
  if (error) throw error;
}


