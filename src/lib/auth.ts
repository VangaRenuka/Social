export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

export function getCurrentUser(): { id: string; username?: string; role?: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setSession(tokens: { access_token: string; refresh_token: string }, user: { id: string; [key: string]: unknown }) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('user_id', user?.id || '');
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_id');
}


