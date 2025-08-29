"use client";
import { useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function NotificationsClient() {
  useEffect(() => {
    const channel = supabaseBrowser
      .channel('realtime:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const n = payload.new as any;
        // naive client-side filter by recipient using localStorage user id if available
        const me = localStorage.getItem('user_id');
        if (!me || n.recipient !== me) return;
        alert(`New notification: ${n.message}`);
      })
      .subscribe();
    return () => { supabaseBrowser.removeChannel(channel); };
  }, []);
  return null;
}


