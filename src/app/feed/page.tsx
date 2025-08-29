"use client";
import { useEffect, useState } from 'react';
import { apiJson } from '@/lib/api';

type Post = { id: string; content: string; image_url?: string | null; created_at: string };

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';

  async function load() {
    try {
      const res = await fetch('/api/feed', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const data = await res.json();
      setPosts(data.results || []);
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function createPost() {
    setError('');
    try {
      const post = await apiJson('/api/posts', 'POST', { content }, token);
      setContent('');
      setPosts([post, ...posts]);
    } catch (e: any) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Your Feed</h1>
      <div className="flex gap-2">
        <input className="border p-2 flex-1" placeholder="What's up?" value={content} onChange={e=>setContent(e.target.value)} />
        <button className="bg-blue-600 text-white px-4" onClick={createPost}>Post</button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <ul className="space-y-3">
        {posts.map(p => (
          <li key={p.id} className="border p-3">
            <div className="text-sm text-gray-500">{new Date(p.created_at).toLocaleString()}</div>
            <div>{p.content}</div>
            {p.image_url && <img src={p.image_url} alt="post" className="mt-2 max-h-64 object-contain" />}
          </li>
        ))}
      </ul>
    </main>
  );
}


