import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies
    const cookies = request.cookies;
    const token = cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { success: false, message: 'Role is required' },
        { status: 400 }
      );
    }

    // Call the backend update-current-role API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/update-current-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update role' },
        { status: response.status }
      );
    }

    // Create response
    const nextResponse = NextResponse.json(
      { success: true, message: data.message || 'Role updated successfully', data },
      { status: 200 }
    );

    // Forward any set-cookie headers from backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('Set-Cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error: any) {
    console.error('Update role error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update role' },
      { status: 500 }
    );
  }
}
