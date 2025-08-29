import { supabaseAdmin } from '@/lib/supabaseClient';

export async function listAllUsers(limit = 50, offset = 0) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('users')
    .select('id, email, username, role, is_active, created_at, last_login')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function getUserDetail(userId: string) {
  const supa = supabaseAdmin();
  const { data, error } = await supa.from('users').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function deactivateUser(userId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('users').update({ is_active: false }).eq('id', userId);
  if (error) throw error;
}

export async function listAllPosts(limit = 50, offset = 0) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function deleteAnyPost(postId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('posts').delete().eq('id', postId);
  if (error) throw error;
}

export async function getStats() {
  const supa = supabaseAdmin();
  const [{ data: users }, { data: posts }] = await Promise.all([
    supa.from('users').select('id', { count: 'exact', head: true }),
    supa.from('posts').select('id', { count: 'exact', head: true }),
  ]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: activeToday } = await supa
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());
  return { total_users: users?.length ?? 0, total_posts: posts?.length ?? 0, active_today: activeToday ?? 0 };
}


