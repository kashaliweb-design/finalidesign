import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get authentication token from cookies
    const cookies = request.cookies;
    const accessToken = cookies.get('accessToken')?.value || cookies.get('token')?.value;
    
    // Debug: Log all cookies
    const allCookies: any = {};
    cookies.getAll().forEach(cookie => {
      allCookies[cookie.name] = cookie.value.substring(0, 20) + '...';
    });
    console.log('Get Onboarding - All cookies:', allCookies);
    console.log('Get Onboarding - Access token:', accessToken ? 'Found (length: ' + accessToken.length + ')' : 'NOT FOUND');
    
    if (!accessToken) {
      console.error('Get Onboarding - No authentication token found in cookies');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No authentication token found' },
        { status: 401 }
      );
    }

    // Build cookie header
    const cookieHeader = `accessToken=${accessToken}`;

    console.log('Getting onboarding data from backend');

    // Call backend API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/user/get-onboarding', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to get onboarding data' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Get onboarding error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
