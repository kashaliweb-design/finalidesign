import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookies = request.cookies;
    const token = cookies.get('token')?.value;

    // Call backend logout endpoint
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Cookie': `token=${token}` }),
      },
      credentials: 'include',
    });

    // Create response
    const nextResponse = NextResponse.json(
      { message: 'Logged out successfully' }, 
      { status: 200 }
    );

    // Clear cookies by setting them with expired date
    nextResponse.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    // Forward any set-cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('Set-Cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
