import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Call the backend verify-email API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Email verification failed' },
        { status: response.status }
      );
    }

    // Create response with data
    const nextResponse = NextResponse.json(
      { success: true, message: data.message || 'Email verified successfully', data },
      { status: 200 }
    );

    // Check if backend sent cookies in Set-Cookie header
    const setCookieHeaders = response.headers.getSetCookie();
    
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Forward all cookies from backend, but modify for localhost
      setCookieHeaders.forEach(cookie => {
        let modifiedCookie = cookie;
        if (process.env.NODE_ENV !== 'production') {
          modifiedCookie = cookie
            .replace(/; Secure/gi, '')
            .replace(/SameSite=None/gi, 'SameSite=Lax');
        }
        nextResponse.headers.append('Set-Cookie', modifiedCookie);
      });
    }

    // If backend sends token in response body instead of cookie, set it as cookie
    const token = data.token || data.accessToken || data.authToken;
    if (token) {
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
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Email verification failed' },
      { status: 500 }
    );
  }
}
