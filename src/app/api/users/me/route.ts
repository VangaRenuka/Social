import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { getProfileByUserId, upsertProfile } from '@/server/db/queries/profiles';
import { z } from 'zod';

const schema = z.object({
  bio: z.string().max(160).optional(),
  website: z.string().url().optional(),
  location: z.string().optional(),
  visibility: z.enum(['public', 'private', 'followers_only']).optional(),
});

export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const profile = await getProfileByUserId(auth.userId);
  return Response.json(profile, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  const updated = await upsertProfile(auth.userId, parsed.data);
  return Response.json(updated, { status: 200 });
}

export const PATCH = PUT;


