import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Capture the raw cookie string from the incoming browser request
    const incomingCookieHeader = request.headers.get('cookie') || '';
    
    const cookies = request.cookies;
    let accessToken = cookies.get('accessToken')?.value || cookies.get('token')?.value;
    
    if (!accessToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }
    }
    
    console.log('Referral Source - Access token:', accessToken ? 'Found (length: ' + accessToken.length + ')' : 'NOT FOUND');
    console.log('Referral Source - Request body:', body);
    
    if (!accessToken) {
      console.error('Referral Source - No authentication token found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No authentication token found' },
        { status: 401 }
      );
    }

    console.log('Calling external API with referral source:', body.source);

    // Convert source to array and uppercase if it's not already an array (backend expects array with uppercase values)
    let sourceArray = Array.isArray(body.source) ? body.source : [body.source];
    sourceArray = sourceArray.map((s: string) => s.toUpperCase());
    
    const backendBody = {
      ...body,
      source: sourceArray
    };

    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/user/user-referral-source', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 2. Forward the cookies to the VPS so it recognizes the session
        'Cookie': incomingCookieHeader, 
        // We keep the Authorization header as a fallback/secondary check
        'Authorization': `Bearer ${accessToken}`, 
      },
      body: JSON.stringify(backendBody),
    });

    console.log('External API response status:', response.status);
    console.log('External API response content-type:', response.headers.get('content-type'));

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
    console.log('External API response data:', data);

    if (!response.ok) {
      console.error('External API error:', data);
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