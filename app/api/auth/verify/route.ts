import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get cookies from request
    const cookies = request.cookies;
    const token = cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, message: 'No token found' },
        { status: 401 }
      );
    }

    // Verify token with backend
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { authenticated: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true, user: data.user || data },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, message: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
