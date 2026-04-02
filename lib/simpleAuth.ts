/**
 * Simple permanent admin authentication
 * Credentials: admin@escortnepal.com / admin@1498
 */

const ADMIN_EMAIL = 'admin@escortnepal.com';
const ADMIN_PASSWORD = 'admin@1498';
const SESSION_KEY = 'admin_session';
const SESSION_TOKEN = 'admin_auth_token_verified';

export function validateAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function setAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, SESSION_TOKEN);
  }
}

export function getAdminSession(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SESSION_KEY) === SESSION_TOKEN;
  }
  return false;
}

export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}
