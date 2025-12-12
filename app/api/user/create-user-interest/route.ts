import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock implementation - simulate saving user interest
    console.log('Saving user interest:', body.name);
    
    // Simulate successful response
    const mockResponse = {
      success: true,
      message: 'User interest saved successfully',
      data: {
        id: Date.now().toString(),
        name: body.name,
        userId: 'mock-user-id',
        createdAt: new Date().toISOString()
      }
    };

    return NextResponse.json(mockResponse, { status: 200 });
  } catch (error: any) {
    console.error('Create user interest error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
