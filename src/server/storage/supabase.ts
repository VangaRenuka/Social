import { supabaseAdmin } from '@/lib/supabaseClient';

export async function uploadImage(
  bucket: string,
  path: string,
  file: Buffer,
  mimeType: string
) {
  const supa = supabaseAdmin();
  const { data, error } = await supa.storage.from(bucket).upload(path, file, {
    contentType: mimeType,
    upsert: true,
  });
  if (error) throw error;
  const { data: publicUrl } = supa.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl.publicUrl;
}


