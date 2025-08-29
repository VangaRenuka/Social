import { SignJWT, jwtVerify } from 'jose';

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret');

export type JwtPayload = {
  sub: string; // user id
  role: 'user' | 'admin';
};

export async function signAccessToken(payload: JwtPayload, expiresIn = '15m') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function signRefreshToken(payload: JwtPayload, expiresIn = '7d') {
  return await new SignJWT({ ...payload, typ: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

export async function verifyToken<T = Record<string, unknown>>(token: string): Promise<T> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as T;
}


