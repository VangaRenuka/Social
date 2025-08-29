"use client";
import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/auth';

export default function Home() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    setAuthed(!!getAccessToken());
  }, []);
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">SocialConnect</h1>
      <p className="text-gray-600">Next.js + Supabase backend is running.</p>
      <div className="space-x-4">
        {!authed ? (
          <>
            <a className="text-blue-600 underline" href="/auth/login">Login</a>
            <a className="text-blue-600 underline" href="/auth/register">Register</a>
          </>
        ) : (
          <>
            <a className="text-blue-600 underline" href="/profile">Profile</a>
            <a className="text-blue-600 underline" href="/feed">Feed</a>
          </>
        )}
      </div>
    </main>
  );
}


