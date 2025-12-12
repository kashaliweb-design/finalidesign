import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get user data from localStorage (for mock implementation)
    const userData = request.headers.get('user-data');
    
    // Mock implementation - simulate saving referral source
    console.log('Saving referral source:', body.source);
    
    // Simulate successful response
    const mockResponse = {
      success: true,
      message: 'Referral source saved successfully',
      data: {
        id: Date.now().toString(),
        source: body.source,
        userId: userData ? JSON.parse(userData).id : 'mock-user-id',
        createdAt: new Date().toISOString()
      }
    };

    return NextResponse.json(mockResponse, { status: 200 });
  } catch (error: any) {
    console.error('Create user referral source error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
