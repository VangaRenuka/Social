import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { findUserByEmailOrUsername, updateLastLogin } from '@/server/db/queries/users';
import { signAccessToken, signRefreshToken } from '@/server/auth/jwt';

const schema = z.object({
  identifier: z.string().min(3), // email or username
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const user = await findUserByEmailOrUsername(parsed.data.identifier);
    if (!user || !user.is_active) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const ok = await bcrypt.compare(parsed.data.password, user.password_hash);
    if (!ok) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

    await updateLastLogin(user.id);
    const payload = { sub: user.id, role: user.role } as const;
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    return Response.json(
      {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return Response.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}


