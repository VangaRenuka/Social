import { supabaseAdmin } from '@/lib/supabaseClient';

export type Profile = {
	user_id: string;
	bio: string | null;
	avatar_url: string | null;
	website: string | null;
	location: string | null;
	visibility: 'public' | 'private' | 'followers_only';
	followers_count: number;
	following_count: number;
	posts_count: number;
};

export async function getProfileByUserId(userId: string) {
	const supa = supabaseAdmin();
	const { data, error } = await supa
		.from('profiles')
		.select('*')
		.eq('user_id', userId)
		.maybeSingle();
	if (error) throw error;
	return data as Profile | null;
}

export async function upsertProfile(userId: string, fields: Partial<Profile>) {
	const supa = supabaseAdmin();
	const { data, error } = await supa
		.from('profiles')
		.upsert({ user_id: userId, ...fields })
		.select('*')
		.single();
	if (error) throw error;
	return data as Profile;
}

export async function listUsersBasic(search?: string, limit = 20, offset = 0) {
	const supa = supabaseAdmin();
	let query = supa
		.from('users')
		.select('id, email, username, role, is_active, created_at')
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);
	if (search && search.trim()) {
		query = query.ilike('username', `%${search}%`);
	}
	const { data, error } = await query;
	if (error) throw error;
	return data;
}

