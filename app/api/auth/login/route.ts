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
    console.log('Backend response:', data); // Debug log

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
    console.log('Backend Set-Cookie headers:', setCookieHeaders); // Debug log
    
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Forward all cookies from backend
      setCookieHeaders.forEach(cookie => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });
    }

    // If backend sends token in response body instead of cookie, set it as cookie
    const token = data.token || data.accessToken || data.authToken;
    if (token) {
      console.log('Token found in response body, setting as cookie:', token); // Debug log
      
      // Set token as HTTP-only cookie
      nextResponse.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
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
