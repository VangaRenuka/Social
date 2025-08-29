import { supabaseAdmin } from '@/lib/supabaseClient';

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) throw new Error('Cannot follow yourself');
  const supa = supabaseAdmin();
  const { error } = await supa.from('follows').insert({ follower: followerId, following: followingId });
  if (error && error.code !== '23505') throw error; // ignore duplicate
}

export async function unfollowUser(followerId: string, followingId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('follows').delete().eq('follower', followerId).eq('following', followingId);
  if (error) throw error;
}

export async function listFollowers(userId: string, limit = 20, offset = 0) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('follows')
    .select('follower')
    .eq('following', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data?.map((r: { follower: string }) => r.follower) as string[];
}

export async function listFollowing(userId: string, limit = 20, offset = 0) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('follows')
    .select('following')
    .eq('follower', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data?.map((r: { following: string }) => r.following) as string[];
}


