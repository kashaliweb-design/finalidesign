import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Call the backend verify-forgot-password API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/verify-forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'OTP verification failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: data.message || 'OTP verified successfully', data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verify forgot password OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'OTP verification failed' },
      { status: 500 }
    );
  }
}
