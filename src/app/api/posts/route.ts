import { NextRequest } from 'next/server';
import { requireAuth } from '@/server/auth/session';
import { createPost, listPosts } from '@/server/db/queries/posts';
import { uploadImage } from '@/server/storage/supabase';
import sharp from 'sharp';
import { z } from 'zod';

const ACCEPTED = ['image/jpeg', 'image/png'];
const MAX_MB = Number(process.env.MAX_IMAGE_MB || 2);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || '1');
  const limit = 20;
  const offset = (page - 1) * limit;
  const posts = await listPosts(limit, offset);
  return Response.json({ results: posts, page }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const jsonSchema = z.object({ content: z.string().max(280), category: z.enum(['general','announcement','question']).optional() });
    const body = await req.json();
    const parsed = jsonSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
    const post = await createPost({ author_id: auth.userId, content: parsed.data.content, category: parsed.data.category });
    return Response.json(post, { status: 201 });
  }

  // multipart form: content, category, file
  const form = await req.formData();
  const content = String(form.get('content') || '');
  const category = (String(form.get('category') || 'general') as 'general'|'announcement'|'question');
  if (!content || content.length > 280) return Response.json({ error: 'Content required (<=280 chars)' }, { status: 400 });
  const file = form.get('file');
  let imageUrl: string | null = null;
  if (file && file instanceof File) {
    if (!ACCEPTED.includes(file.type)) return Response.json({ error: 'Only JPEG/PNG allowed' }, { status: 400 });
    const buf = Buffer.from(await file.arrayBuffer());
    const sizeMb = buf.byteLength / (1024*1024);
    if (sizeMb > MAX_MB) return Response.json({ error: `Max size ${MAX_MB}MB` }, { status: 400 });
    const normalized = await sharp(buf).rotate().resize(1280, 1280, { fit: 'inside', withoutEnlargement: true }).toFormat(file.type==='image/png'?'png':'jpeg').toBuffer();
    const ext = file.type==='image/png'?'png':'jpg';
    const path = `posts/${auth.userId}-${Date.now()}.${ext}`;
    imageUrl = await uploadImage(process.env.SUPABASE_BUCKET || 'avatars', path, normalized, file.type);
  }
  const post = await createPost({ author_id: auth.userId, content, category, image_url: imageUrl });
  return Response.json(post, { status: 201 });
}


