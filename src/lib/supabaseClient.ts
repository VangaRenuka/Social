import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Public client for browser usage (anon key)
export const supabaseBrowser: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Server-side admin client (service role). Never expose to the browser.
export const supabaseAdmin = (): SupabaseClient => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};


