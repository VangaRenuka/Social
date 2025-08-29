import { NextRequest } from 'next/server';
import { z } from 'zod';
import { verifyEmailToken, markEmailVerified } from '@/server/db/queries/auth';

export async function POST(req: NextRequest) {
  const schema = z.object({ user_id: z.string().uuid(), token: z.string().min(10) });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  const ok = await verifyEmailToken(parsed.data.user_id, parsed.data.token);
  if (!ok) return Response.json({ error: 'Invalid or expired token' }, { status: 400 });
  await markEmailVerified(parsed.data.user_id);
  return Response.json({ success: true }, { status: 200 });
}


