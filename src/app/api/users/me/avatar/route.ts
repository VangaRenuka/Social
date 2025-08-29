import { requireAuth } from '@/server/auth/session';
import { uploadImage } from '@/server/storage/supabase';
import sharp from 'sharp';

const ACCEPTED = ['image/jpeg', 'image/png'];
const MAX_MB = Number(process.env.MAX_IMAGE_MB || 2);

export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth instanceof Response) return auth;

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) return Response.json({ error: 'file is required' }, { status: 400 });

  const mime = file.type;
  if (!ACCEPTED.includes(mime)) return Response.json({ error: 'Only JPEG/PNG allowed' }, { status: 400 });

  const arrayBuf = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuf);
  const sizeMb = buf.byteLength / (1024 * 1024);
  if (sizeMb > MAX_MB) return Response.json({ error: `Max size ${MAX_MB}MB` }, { status: 400 });

  // Normalize image (strip metadata, resize to reasonable max)
  const normalized = await sharp(buf)
    .rotate()
    .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
    .toFormat(mime === 'image/png' ? 'png' : 'jpeg')
    .toBuffer();

  const ext = mime === 'image/png' ? 'png' : 'jpg';
  const path = `avatars/${auth.userId}.${ext}`;
  const publicUrl = await uploadImage(process.env.SUPABASE_BUCKET || 'avatars', path, normalized, mime);

  return Response.json({ avatar_url: publicUrl }, { status: 200 });
}


