"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { verifyAuth, setupAutoRefresh } from "@/utils/auth";

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * AuthProvider component
 * Wraps pages that require authentication
 * Automatically refreshes token every 30 minutes
 */
export default function AuthProvider({ children, requireAuth = false }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(requireAuth);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { authenticated } = await verifyAuth();
      setAuthenticated(authenticated);

      if (requireAuth && !authenticated) {
        router.push(`/auth?redirect=${pathname}`);
      }

      setLoading(false);
    };

    checkAuth();

    // Setup auto-refresh (every 30 minutes)
    const cleanup = setupAutoRefresh(30);

    return () => {
      if (cleanup) cleanup();
    };
  }, [requireAuth, router, pathname]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem',
          }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
