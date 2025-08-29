"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiJson } from '@/lib/api';

export default function ProfilePage() {
  type Profile = { avatar_url?: string; bio?: string; [key: string]: unknown };
  const [profile, setProfile] = useState<Profile | null>(null);
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
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'message' in e) {
        setMessage((e as Error).message);
      } else {
        setMessage('An error occurred');
      }
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="space-y-2">
        <label className="text-sm">Bio</label>
        <textarea className="border p-2 w-full" value={bio} onChange={e=>setBio(e.target.value)} />
        <button className="bg-emerald-600 text-white px-4 py-2" onClick={save}>Save</button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
      {typeof profile?.avatar_url === 'string' && profile.avatar_url && (
        <Image src={profile.avatar_url} alt="avatar" className="w-24 h-24 rounded-full" width={96} height={96} />
      )}
    </div>
  );
}


