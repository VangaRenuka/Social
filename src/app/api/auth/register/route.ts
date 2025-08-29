import { NextRequest } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { createUser, findUserByEmailOrUsername } from '@/server/db/queries/users';

const schema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .regex(/^[A-Za-z0-9_]{3,30}$/),
  password: z.string().min(8).max(72),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
    }

    const exists = await findUserByEmailOrUsername(parsed.data.email) || (await findUserByEmailOrUsername(parsed.data.username));
    if (exists) {
      return Response.json({ error: 'Email or username already in use' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(parsed.data.password, 10);
    const user = await createUser({
      email: parsed.data.email,
      username: parsed.data.username,
      password_hash,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
    });

    // TODO: create email verification token and send email via Supabase Functions or external service
    return Response.json({ id: user.id, email: user.email, username: user.username }, { status: 201 });
  } catch (err: any) {
    return Response.json({ error: 'Server error', details: err.message }, { status: 500 });
  }
}


