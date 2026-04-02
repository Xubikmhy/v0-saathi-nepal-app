'use client';

/**
 * Client-side session management utilities
 */

const SESSION_KEY = 'admin_authenticated';

export function setClientSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, 'true');
    // Also set a flag for server-side cookie
    localStorage.setItem('admin_session_cookie', 'verified');
  }
}

export function getClientSession(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SESSION_KEY) === 'true';
  }
  return false;
}

export function clearClientSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('admin_session_cookie');
  }
}
