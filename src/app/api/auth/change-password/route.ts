import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { requireAuth } from '@/server/auth/session';
import { findUserById } from '@/server/db/queries/users';
import { setPassword } from '@/server/db/queries/auth';

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const schema = z.object({ current_password: z.string().min(8), new_password: z.string().min(8).max(72) });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  const user = await findUserById(auth.userId);
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 });
  const ok = await bcrypt.compare(parsed.data.current_password, user.password_hash);
  if (!ok) return Response.json({ error: 'Current password invalid' }, { status: 400 });
  const hash = await bcrypt.hash(parsed.data.new_password, 10);
  await setPassword(auth.userId, hash);
  return Response.json({ success: true }, { status: 200 });
}


