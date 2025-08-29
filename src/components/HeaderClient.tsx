"use client";
import { useEffect, useState } from 'react';
import { clearSession, getAccessToken, getCurrentUser } from '@/lib/auth';

export default function HeaderClient() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<string>('user');
  useEffect(() => {
    const token = getAccessToken();
    const user = getCurrentUser();
    setIsAuthed(!!token);
    setUsername(user?.username || '');
    setRole(user?.role || 'user');
  }, []);

  function logout() {
    clearSession();
    window.location.href = '/';
  }

  return (
    <div className="space-x-4 text-sm">
      {isAuthed ? (
        <>
          <span className="text-gray-600">{username || 'Signed in'}</span>
          <a href="/feed">Feed</a>
          <a href="/profile">Profile</a>
          {role === 'admin' && <a href="/admin">Admin</a>}
          <button onClick={logout} className="text-red-600">Logout</button>
        </>
      ) : (
        <>
          <a href="/auth/login">Login</a>
          <a href="/auth/register">Register</a>
        </>
      )}
    </div>
  );
}


