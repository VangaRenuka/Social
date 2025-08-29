"use client";
import { useEffect, useState } from 'react';

import { getAccessToken, getCurrentUser } from '@/lib/auth';
import { apiJson } from '@/lib/api';

type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
};
type Post = {
  id: string;
  content: string;
  like_count: number;
  comment_count: number;
};
type Stats = {
  total_users: number;
  total_posts: number;
  active_today: number;
};

export default function AdminPage() {
  const [allowed, setAllowed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const token = typeof window !== 'undefined' ? getAccessToken() || '' : '';


  // Make load reusable
  const load = async () => {
    const me = getCurrentUser();
    if (!me || me.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    setAllowed(true);
    const [{ results: u }, { results: p }, s] = await Promise.all([
      apiJson('/api/admin/users?page=1', 'GET', undefined, token),
      apiJson('/api/admin/posts?page=1', 'GET', undefined, token),
      apiJson('/api/admin/stats', 'GET', undefined, token),
    ]);
    setUsers(u || []);
    setPosts(p || []);
    setStats(s || null);
  };

  useEffect(() => {
    load();
  }, [token]);

  async function deactivate(userId: string) {
    await apiJson(`/api/admin/users/${userId}/deactivate`, 'POST', {}, token);
    await load();
  }
  async function removePost(postId: string) {
    await apiJson(`/api/admin/posts/${postId}`, 'DELETE', undefined, token);
    await load();
  }

  if (!allowed) return null;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <section>
        <h2 className="font-semibold mb-2">Stats</h2>
  <div className="text-sm text-gray-700">Users: {stats?.total_users ?? 0} · Posts: {stats?.total_posts ?? 0} · Active today: {stats?.active_today ?? 0}</div>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Users</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2">Role</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2 text-center">{u.role}</td>
                <td className="p-2 text-center">{u.is_active ? 'Yes' : 'No'}</td>
                <td className="p-2 text-center">
                  {u.is_active && <button className="text-red-600" onClick={() => deactivate(u.id)}>Deactivate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="font-semibold mb-2">Posts</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Content</th>
              <th className="p-2">Likes</th>
              <th className="p-2">Comments</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{typeof p.id === 'string' ? p.id.slice(0,8) : ''}…</td>
                <td className="p-2">{p.content}</td>
                <td className="p-2 text-center">{p.like_count}</td>
                <td className="p-2 text-center">{p.comment_count}</td>
                <td className="p-2 text-center">
                  <button className="text-red-600" onClick={() => removePost(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}


