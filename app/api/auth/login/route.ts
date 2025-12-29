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
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response content-type:', response.headers.get('content-type'));

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Backend returned non-JSON response:', textResponse.substring(0, 200));
      return NextResponse.json(
        { 
          message: 'Backend server error: Expected JSON response but received HTML. The backend server may be down or misconfigured.',
          details: 'Please check if the backend server at https://srv746619.hstgr.cloud is running correctly.'
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log('Backend login response:', JSON.stringify(data, null, 2)); // Debug log

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Login failed' },
        { status: response.status }
      );
    }

    // Extract token for response body
    const token = data.token || data.accessToken || data.authToken || 
                  (data.data && (data.data.token || data.data.accessToken)) ||
                  (data.tokens && data.tokens.accessToken);
    
    // Create response with data, ensuring token is in response body
    const responseData = {
      ...data,
      token: token, // Ensure token is available in response body
      accessToken: token
    };
    
    const nextResponse = NextResponse.json(responseData, { status: 200 });

    // Check if backend sent cookies in Set-Cookie header
    const setCookieHeader = response.headers.get('set-cookie');
    console.log('Backend Set-Cookie header:', setCookieHeader); // Debug log
    
    if (setCookieHeader) {
      // Split multiple cookies if they exist
      const cookies = setCookieHeader.split(',').map(c => c.trim());
      console.log('Backend cookies count:', cookies.length);
      
      // Forward all cookies from backend, but modify for localhost
      cookies.forEach(cookie => {
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
      console.log('Total cookies forwarded:', cookies.length);
    } else {
      console.log('No Set-Cookie headers received from backend');
    }

    // Set token as cookie if available
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
