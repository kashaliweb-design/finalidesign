import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Call the backend resend-otp API
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/auth/resend-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to resend OTP' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { success: true, message: data.message || 'OTP resent successfully', data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to resend OTP' },
      { status: 500 }
    );
  }
}
