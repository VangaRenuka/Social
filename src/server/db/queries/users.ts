import { supabaseAdmin } from '@/lib/supabaseClient';

export type UserRecord = {
  id: string;
  email: string;
  username: string;
  password_hash: string;
  first_name: string | null;
  last_name: string | null;
  role: 'user' | 'admin';
  is_active: boolean;
  email_verified: boolean;
  last_login: string | null;
};

export async function findUserByEmailOrUsername(identifier: string) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('users')
    .select('*')
    .or(`email.eq.${identifier},username.eq.${identifier}`)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as UserRecord | null;
}

export async function createUser(user: {
  email: string;
  username: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
}) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('users')
    .insert({
      email: user.email,
      username: user.username,
      password_hash: user.password_hash,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as UserRecord;
}

export async function updateLastLogin(userId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

export async function findUserById(userId: string) {
  const supa = supabaseAdmin();
  const { data, error } = await supa.from('users').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  return data as UserRecord | null;
}


