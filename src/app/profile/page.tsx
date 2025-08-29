"use client";
import { useEffect, useState } from 'react';
import { apiJson } from '@/lib/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';

  async function load() {
    const res = await fetch('/api/users/me', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const data = await res.json();
    setProfile(data);
    setBio(data?.bio || '');
  }

  async function save() {
    try {
      const updated = await apiJson('/api/users/me', 'PUT', { bio }, token);
      setProfile(updated);
      setMessage('Saved');
    } catch (e: any) {
      setMessage(e.message);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="space-y-2">
        <label className="text-sm">Bio</label>
        <textarea className="border p-2 w-full" value={bio} onChange={e=>setBio(e.target.value)} />
        <button className="bg-emerald-600 text-white px-4 py-2" onClick={save}>Save</button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
      {profile?.avatar_url && <img src={profile.avatar_url} alt="avatar" className="w-24 h-24 rounded-full" />}
    </div>
  );
}


