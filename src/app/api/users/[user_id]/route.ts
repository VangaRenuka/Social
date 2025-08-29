import { NextRequest } from 'next/server';
import { getProfileByUserId } from '@/server/db/queries/profiles';

export async function GET(_req: NextRequest, { params }: { params: { user_id: string } }) {
  try {
    const profile = await getProfileByUserId(params.user_id);
    if (!profile) return Response.json({ error: 'Not found' }, { status: 404 });
    return Response.json(profile, { status: 200 });
  } catch (e: any) {
    return Response.json({ error: 'Server error', details: e.message }, { status: 500 });
  }
}


