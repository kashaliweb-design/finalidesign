import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    authenticated: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to get user from localStorage first (for quick UI update)
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        setAuthState({
          user: JSON.parse(storedUser),
          loading: false,
          authenticated: true,
        });
      }

      // Verify with backend using cookies
      const response = await fetch('/api/auth/verify', {
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          loading: false,
          authenticated: true,
        });
        // Update localStorage with fresh data
        localStorage.setItem('userData', JSON.stringify(data.user));
      } else {
        setAuthState({
          user: null,
          loading: false,
          authenticated: false,
        });
        localStorage.removeItem('userData');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        loading: false,
        authenticated: false,
      });
      localStorage.removeItem('userData');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      localStorage.removeItem('userData');
      setAuthState({
        user: null,
        loading: false,
        authenticated: false,
      });
      
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    ...authState,
    logout,
    checkAuth,
  };
}
