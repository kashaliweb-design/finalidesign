import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get authentication token from cookies
    const cookies = request.cookies;
    const accessToken = cookies.get('accessToken')?.value || cookies.get('token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build cookie header
    const cookieHeader = `accessToken=${accessToken}`;

    // Call backend API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/user/update-user', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('External API returned non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { success: false, message: 'Server returned an invalid response. Please try again later.' },
        { status: response.status || 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to update user' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
