import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response content-type:', response.headers.get('content-type'));

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Backend returned non-JSON response:', textResponse.substring(0, 200));
      return NextResponse.json(
        { 
          message: 'Backend server error: Expected JSON response but received HTML. The backend server may be down or misconfigured.',
          details: 'Please check if the backend server at https://srv746619.hstgr.cloud is running correctly.'
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log('Backend signup response:', data); // Debug log

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Signup failed' },
        { status: response.status }
      );
    }

    // Create response with data
    const nextResponse = NextResponse.json(data, { status: 200 });

    // Check if backend sent cookies in Set-Cookie header
    const setCookieHeaders = response.headers.getSetCookie();
    console.log('Backend Set-Cookie headers:', setCookieHeaders); // Debug log
    
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Forward all cookies from backend
      setCookieHeaders.forEach(cookie => {
        nextResponse.headers.append('Set-Cookie', cookie);
      });
    }

    // If backend sends token in response body, set it as cookie
    const token = data.token || data.accessToken || data.authToken;
    if (token) {
      console.log('Token found in signup response, setting as cookie'); // Debug log
      
      nextResponse.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    return nextResponse;
  } catch (error: any) {
    console.error('Signup error:', error); // Debug log
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
