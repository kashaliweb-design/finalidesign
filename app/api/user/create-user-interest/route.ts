import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Get the raw cookie string from the incoming request
    // We want to forward the exact cookies (accessToken, refreshToken) to the VPS
    const incomingCookieHeader = request.headers.get('cookie') || '';
    
    // (Your existing token extraction logic is fine for logging/checking)
    const cookies = request.cookies;
    let accessToken = cookies.get('accessToken')?.value || cookies.get('token')?.value;
    
    if (!accessToken) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }
    }
    
    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No authentication token found' },
        { status: 401 }
      );
    }

    console.log('Calling external API on VPS...');

    // 2. The Fixed Fetch Call
    const response = await fetch('https://srv746619.hstgr.cloud/api/v1/user/user-interest', {
      method: "POST",
      // credentials: "include", <--- REMOVE THIS. It does nothing useful here.
      headers: { 
        "Content-Type": "application/json",
        // CRITICAL FIX: Manually forward the Cookie header
        "Cookie": incomingCookieHeader 
      },
      body: JSON.stringify(body),
    });
  

    // ... (rest of your response handling logic remains the same)
    
    // Be careful with error handling here. 
    // If the VPS returns 401, handle it gracefully.
    const data = await response.json();

    if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
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