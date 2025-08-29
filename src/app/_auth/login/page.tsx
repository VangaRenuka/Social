"use client";
import { useState } from 'react';
import { apiJson } from '@/lib/api';
import { setSession } from '@/lib/auth';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiJson('/api/auth/login', 'POST', { identifier, password });
      setSession({ access_token: res.access_token, refresh_token: res.refresh_token }, res.user);
      setMessage('Logged in. Redirecting to feed...');
      window.location.href = '/feed';
    } catch (e: any) {
      setMessage(e.message);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h2 className="text-2xl font-semibold">Login</h2>
      <input className="border p-2 w-full" placeholder="Email or username" value={identifier} onChange={e=>setIdentifier(e.target.value)} />
      <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2" type="submit">Login</button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
}


