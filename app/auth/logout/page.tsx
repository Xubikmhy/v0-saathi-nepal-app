'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_authenticated');
        localStorage.removeItem('admin_session_cookie');
      }

      // Call logout API to clear cookies
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
      } catch (error) {
        console.error('Logout error:', error);
      }

      // Redirect to login
      router.push('/admin/login');
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Logging out...</h1>
        <p className="text-muted-foreground">Please wait while we log you out.</p>
      </div>
    </div>
  );
}
