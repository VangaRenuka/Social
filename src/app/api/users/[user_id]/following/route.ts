import { listFollowing } from '@/server/db/queries/social';

export async function GET(_req: Request, { params }: { params: { user_id: string } }) {
  const ids = await listFollowing(params.user_id, 50, 0);
  return Response.json({ results: ids }, { status: 200 });
}


