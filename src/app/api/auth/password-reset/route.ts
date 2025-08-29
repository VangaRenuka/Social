import { NextRequest } from 'next/server';
import { z } from 'zod';
import { findUserByEmailOrUsername } from '@/server/db/queries/users';
import { createPasswordResetToken } from '@/server/db/queries/auth';

export async function POST(req: NextRequest) {
  const schema = z.object({ identifier: z.string().min(3) });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  const user = await findUserByEmailOrUsername(parsed.data.identifier);
  if (!user) return Response.json({ success: true }, { status: 200 });
  const token = crypto.randomUUID().replace(/-/g, '');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
  await createPasswordResetToken(user.id, token, expiresAt);
  // TODO: send email containing token and user.id
  return Response.json({ success: true, user_id: user.id, token }, { status: 200 });
}


