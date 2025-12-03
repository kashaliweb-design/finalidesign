import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get cookies from the request
    const cookies = request.cookies;
    const accessToken = cookies.get('accessToken')?.value;
    const refreshToken = cookies.get('refreshToken')?.value;

    // Log all cookies for debugging
    const allCookies: any = {};
    cookies.getAll().forEach(cookie => {
      allCookies[cookie.name] = cookie.value;
    });
    console.log('All cookies received:', allCookies);
    console.log('Access token:', accessToken ? 'Found' : 'Not found');
    console.log('Refresh token:', refreshToken ? 'Found' : 'Not found');

    if (!accessToken) {
      console.error('No access token found in cookies');
      return NextResponse.json(
        { success: false, message: 'No access token found. Please login again.' },
        { status: 401 }
      );
    }

    // Build cookie header with both tokens
    const cookieHeader = `accessToken=${accessToken}${refreshToken ? `; refreshToken=${refreshToken}` : ''}`;
    console.log('Sending cookie header to backend:', cookieHeader.substring(0, 50) + '...');

    // Call the backend user API with cookies
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    });

    console.log('Backend response status:', response.status);

    const data = await response.json();
    console.log('Backend user data response:', data);

    if (!response.ok) {
      console.error('Backend returned error:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch user data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('User API error details:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch user data', error: error.toString() },
      { status: 500 }
    );
  }
}
