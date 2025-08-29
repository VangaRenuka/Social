import { NextRequest } from 'next/server';
import { getProfileByUserId } from '@/server/db/queries/profiles';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const user_id = url.pathname.split('/').pop();
    if (!user_id) return Response.json({ error: 'Missing user_id' }, { status: 400 });
    const profile = await getProfileByUserId(user_id);
    if (!profile) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(profile, { status: 200 });
  } catch (e: unknown) {
    return Response.json({ error: 'Server error', details: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}


