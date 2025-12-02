/**
 * Utility functions for authentication
 */

/**
 * Refresh the authentication token
 * @returns Promise with refresh result
 */
export async function refreshToken(): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to refresh token',
      };
    }

    return {
      success: true,
      message: data.message || 'Token refreshed successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to refresh token',
    };
  }
}

/**
 * Verify if user is authenticated
 * @returns Promise with authentication status
 */
export async function verifyAuth(): Promise<{ authenticated: boolean; user?: any }> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return { authenticated: false };
    }

    const data = await response.json();
    return {
      authenticated: true,
      user: data.user,
    };
  } catch (error) {
    return { authenticated: false };
  }
}

/**
 * Logout user
 * @returns Promise with logout result
 */
export async function logout(): Promise<{ success: boolean }> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData');
      localStorage.clear();
    }

    return { success: true };
  } catch (error) {
    // Clear localStorage even if API fails
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userData');
      localStorage.clear();
    }
    return { success: false };
  }
}

/**
 * Update user's current role
 * @param role - The role to update to (student, instructor, admin)
 * @returns Promise with update result
 */
export async function updateCurrentRole(role: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/auth/update-current-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ role }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to update role',
      };
    }

    return {
      success: true,
      message: data.message || 'Role updated successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to update role',
    };
  }
}

/**
 * Auto-refresh token before expiry
 * Call this function periodically (e.g., every 30 minutes)
 */
export function setupAutoRefresh(intervalMinutes: number = 30) {
  if (typeof window === 'undefined') return;

  const intervalMs = intervalMinutes * 60 * 1000;

  const interval = setInterval(async () => {
    const { authenticated } = await verifyAuth();
    
    if (authenticated) {
      await refreshToken();
    } else {
      clearInterval(interval);
    }
  }, intervalMs);

  return () => clearInterval(interval);
}
