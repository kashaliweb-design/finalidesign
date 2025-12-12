import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include', // Important for cookies
    });

    const data = await response.json();
    console.log('Backend login response:', JSON.stringify(data, null, 2)); // Debug log
    console.log('Backend response status:', response.status);

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      );
    }

    // Create response with data
    const nextResponse = NextResponse.json(data, { status: 200 });

    // Check if backend sent cookies in Set-Cookie header
    const setCookieHeaders = response.headers.getSetCookie();
    console.log('Backend Set-Cookie headers count:', setCookieHeaders?.length || 0);
    console.log('Backend Set-Cookie headers:', setCookieHeaders); // Debug log
    
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Forward all cookies from backend, but modify for localhost
      setCookieHeaders.forEach(cookie => {
        console.log('Original cookie:', cookie);
        // For localhost, remove Secure and change SameSite to Lax
        let modifiedCookie = cookie;
        if (process.env.NODE_ENV !== 'production') {
          modifiedCookie = cookie
            .replace(/; Secure/gi, '')
            .replace(/SameSite=None/gi, 'SameSite=Lax');
        }
        console.log('Modified cookie:', modifiedCookie);
        nextResponse.headers.append('Set-Cookie', modifiedCookie);
      });
      console.log('Total cookies forwarded:', setCookieHeaders.length);
    } else {
      console.log('No Set-Cookie headers received from backend');
    }

    // If backend sends token in response body instead of cookie, set it as cookie
    // Check multiple possible locations for the token
    const token = data.token || data.accessToken || data.authToken || 
                  (data.data && (data.data.token || data.data.accessToken)) ||
                  (data.tokens && data.tokens.accessToken);
    
    console.log('Token extraction attempt:');
    console.log('  - data.token:', data.token ? 'Found' : 'Not found');
    console.log('  - data.accessToken:', data.accessToken ? 'Found' : 'Not found');
    console.log('  - data.data.token:', data.data?.token ? 'Found' : 'Not found');
    console.log('  - data.data.accessToken:', data.data?.accessToken ? 'Found' : 'Not found');
    console.log('  - Final token:', token ? 'FOUND (length: ' + token.length + ')' : 'NOT FOUND');
    
    if (token) {
      console.log('Setting token as cookie (first 20 chars):', token.substring(0, 20) + '...'); // Debug log
      
      // Set token as HTTP-only cookie (both names for compatibility)
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      };
      
      nextResponse.cookies.set('token', token, cookieOptions);
      nextResponse.cookies.set('accessToken', token, cookieOptions);
    }

    return nextResponse;
  } catch (error: any) {
    console.error('Login error:', error); // Debug log
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
