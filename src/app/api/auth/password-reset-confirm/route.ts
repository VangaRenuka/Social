import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { verifyPasswordResetToken, deletePasswordResetToken, setPassword } from '@/server/db/queries/auth';

export async function POST(req: NextRequest) {
  const schema = z.object({ user_id: z.string().uuid(), token: z.string().min(10), new_password: z.string().min(8).max(72) });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  const valid = await verifyPasswordResetToken(parsed.data.user_id, parsed.data.token);
  if (!valid) return Response.json({ error: 'Invalid or expired token' }, { status: 400 });
  const hash = await bcrypt.hash(parsed.data.new_password, 10);
  await setPassword(parsed.data.user_id, hash);
  await deletePasswordResetToken(parsed.data.user_id, parsed.data.token);
  return Response.json({ success: true }, { status: 200 });
}


