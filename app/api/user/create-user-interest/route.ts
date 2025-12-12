import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get authentication token from cookies
    const cookies = request.cookies;
    const accessToken = cookies.get('accessToken')?.value || cookies.get('token')?.value;
    
    // Debug: Log all cookies
    const allCookies: any = {};
    cookies.getAll().forEach(cookie => {
      allCookies[cookie.name] = cookie.value.substring(0, 20) + '...';
    });
    console.log('User Interest - All cookies:', allCookies);
    console.log('User Interest - Access token:', accessToken ? 'Found (length: ' + accessToken.length + ')' : 'NOT FOUND');
    
    if (!accessToken) {
      console.error('User Interest - No authentication token found in cookies');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No authentication token found' },
        { status: 401 }
      );
    }

    // Build cookie header
    const cookieHeader = `accessToken=${accessToken}`;

    console.log('Saving user interest:', body.name);

    // Call backend API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/user/create-user-interest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create user interest' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Create user interest error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
