import { supabaseAdmin } from '@/lib/supabaseClient';

export type Post = {
	id: string;
	author_id: string;
	content: string;
	image_url: string | null;
	category: 'general' | 'announcement' | 'question';
	is_active: boolean;
	like_count: number;
	comment_count: number;
	created_at: string;
	updated_at: string;
};

export async function createPost(input: { author_id: string; content: string; image_url?: string | null; category?: Post['category'] }) {
	const supa = supabaseAdmin();
	const { data, error } = await supa
		.from('posts')
		.insert({ author_id: input.author_id, content: input.content, image_url: input.image_url || null, category: input.category || 'general' })
		.select('*')
		.single();
	if (error) throw error;
	return data as Post;
}

export async function listPosts(limit = 20, offset = 0) {
	const supa = supabaseAdmin();
	const { data, error } = await supa
		.from('posts')
		.select('*')
		.eq('is_active', true)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1);
	if (error) throw error;
	return data as Post[];
}

export async function getPostById(postId: string) {
	const supa = supabaseAdmin();
	const { data, error } = await supa.from('posts').select('*').eq('id', postId).maybeSingle();
	if (error) throw error;
	return data as Post | null;
}

export async function updatePost(postId: string, authorId: string, fields: Partial<Pick<Post, 'content' | 'image_url' | 'category' | 'is_active'>>) {
	const supa = supabaseAdmin();
	const { data, error } = await supa
		.from('posts')
		.update(fields)
		.eq('id', postId)
		.eq('author_id', authorId)
		.select('*')
		.single();
	if (error) throw error;
	return data as Post;
}

export async function deletePost(postId: string, authorId: string) {
	const supa = supabaseAdmin();
	const { error } = await supa.from('posts').delete().eq('id', postId).eq('author_id', authorId);
	if (error) throw error;
}
