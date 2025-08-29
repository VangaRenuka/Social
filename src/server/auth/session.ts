import { headers } from 'next/headers';
import { verifyToken } from '@/server/auth/jwt';

export type AuthContext = {
  userId: string | null;
  role: 'user' | 'admin' | null;
  token: string | null;
};

export async function getAuthContext(): Promise<AuthContext> {
  const h = await headers();
  const auth = h.get('authorization') || h.get('Authorization');
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
    return { userId: null, role: null, token: null };
  }
  const token = auth.slice(7).trim();
  try {
    const payload = await verifyToken<{ sub: string; role: 'user' | 'admin' }>(token);
    return { userId: payload.sub, role: payload.role, token };
  } catch {
    return { userId: null, role: null, token: null };
  }
}

export async function requireAuth(): Promise<{ userId: string; role: 'user' | 'admin' } | Response> {
  const ctx = await getAuthContext();
  if (!ctx.userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  return { userId: ctx.userId, role: (ctx.role || 'user') as 'user' | 'admin' };
}


