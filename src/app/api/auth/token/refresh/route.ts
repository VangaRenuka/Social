import { NextRequest } from 'next/server';
import { z } from 'zod';
import { verifyToken, signAccessToken, signRefreshToken } from '@/server/auth/jwt';

const schema = z.object({ refresh_token: z.string().min(20) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });

    const payload = await verifyToken<any>(parsed.data.refresh_token);
    if (payload?.typ !== 'refresh') {
      return Response.json({ error: 'Invalid token type' }, { status: 401 });
    }
    const access = await signAccessToken({ sub: payload.sub, role: payload.role });
    const refresh = await signRefreshToken({ sub: payload.sub, role: payload.role });
    return Response.json({ access_token: access, refresh_token: refresh }, { status: 200 });
  } catch (err: any) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}


