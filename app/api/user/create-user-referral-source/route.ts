import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get authentication token from cookies or Authorization header
    const cookies = request.cookies;
    let accessToken = cookies.get('accessToken')?.value || cookies.get('token')?.value;
    
    // Fallback to Authorization header if no cookie
    if (!accessToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }
    }
    
    // Debug: Log all cookies
    const allCookies: any = {};
    cookies.getAll().forEach(cookie => {
      allCookies[cookie.name] = cookie.value.substring(0, 20) + '...';
    });
    console.log('Referral Source - All cookies:', allCookies);
    console.log('Referral Source - Authorization header:', request.headers.get('Authorization') ? 'Present' : 'Not present');
    console.log('Referral Source - Access token:', accessToken ? 'Found (length: ' + accessToken.length + ')' : 'NOT FOUND');
    
    if (!accessToken) {
      console.error('Referral Source - No authentication token found in cookies or Authorization header');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No authentication token found' },
        { status: 401 }
      );
    }

    // Build cookie header
    const cookieHeader = `accessToken=${accessToken}`;

    console.log('Saving referral source:', body.source);

    // Call backend API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/user/user-referral-source', {
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
        { success: false, message: data.message || 'Failed to create user referral source' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Create user referral source error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
