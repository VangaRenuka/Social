import { supabaseAdmin } from '@/lib/supabaseClient';

export async function createNotification(input: { recipient: string; sender: string; type: 'follow' | 'like' | 'comment'; post_id?: string | null; message: string }) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('notifications').insert({
    recipient: input.recipient,
    sender: input.sender,
    notification_type: input.type,
    post_id: input.post_id || null,
    message: input.message,
  });
  if (error) throw error;
}

export async function listNotifications(userId: string, limit = 20, offset = 0) {
  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('notifications')
    .select('*')
    .eq('recipient', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data || [];
}

export async function markRead(notificationId: string, userId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('notifications').update({ is_read: true }).eq('id', notificationId).eq('recipient', userId);
  if (error) throw error;
}

export async function markAllRead(userId: string) {
  const supa = supabaseAdmin();
  const { error } = await supa.from('notifications').update({ is_read: true }).eq('recipient', userId).eq('is_read', false);
  if (error) throw error;
}


