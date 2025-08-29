import { supabaseAdmin } from '@/lib/supabaseClient';

export async function getFeedForUser(userId: string, limit = 20, offset = 0) {
  const supa = supabaseAdmin();
  // get following ids
  const { data: following, error: errF } = await supa
    .from('follows')
    .select('following')
    .eq('follower', userId);
  if (errF) throw errF;
  const followingIds = (following || []).map((r: { following: string }) => r.following);
  followingIds.push(userId); // include self

  const { data, error } = await supa
    .from('posts')
    .select('*')
    .in('author_id', followingIds)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data || [];
}


