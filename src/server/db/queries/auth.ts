import { supabaseAdmin } from '@/lib/supabaseClient';

export async function setPassword(userId: string, password_hash: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('users').update({ password_hash }).eq('id', userId);
  if (error) throw error;
}

export async function createPasswordResetToken(userId: string, token: string, expiresAt: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('password_reset_tokens').insert({ user_id: userId, token, expires_at: expiresAt });
  if (error) throw error;
}

export async function verifyPasswordResetToken(userId: string, token: string) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('password_reset_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('token', token)
    .gte('expires_at', new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function deletePasswordResetToken(userId: string, token: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('password_reset_tokens').delete().eq('user_id', userId).eq('token', token);
  if (error) throw error;
}

export async function createEmailVerificationToken(userId: string, token: string, expiresAt: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('email_verification_tokens').insert({ user_id: userId, token, expires_at: expiresAt });
  if (error) throw error;
}

export async function verifyEmailToken(userId: string, token: string) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('email_verification_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('token', token)
    .gte('expires_at', new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function markEmailVerified(userId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('users').update({ email_verified: true }).eq('id', userId);
  if (error) throw error;
}


