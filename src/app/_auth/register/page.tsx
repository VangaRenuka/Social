"use client";
import { useState } from 'react';
import { apiJson } from '@/lib/api';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiJson('/api/auth/register', 'POST', { email, username, password });
      setMessage('Registered. Please verify email (token returned via API placeholder).');
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'message' in e) {
        setMessage((e as Error).message);
      } else {
        setMessage('An error occurred');
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <h2 className="text-2xl font-semibold">Register</h2>
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-green-600 text-white px-4 py-2" type="submit">Register</button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </form>
  );
}


