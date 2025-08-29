import { NextRequest } from 'next/server';
import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabaseClient';

const schema = z.object({ refresh_token: z.string().min(20) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

  // store token in blacklist
  const supa = supabaseAdmin();
  await supa.from('revoked_tokens').insert({ token: parsed.data.refresh_token }).select('*');
  return Response.json({ success: true }, { status: 200 });
}


