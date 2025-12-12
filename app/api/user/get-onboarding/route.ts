import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock implementation - simulate getting onboarding data
    console.log('Getting onboarding data');
    
    // Simulate onboarding data response
    const mockResponse = {
      success: true,
      message: 'Onboarding data retrieved successfully',
      data: {
        completed: false,
        steps: {
          referralSource: false,
          interests: false
        },
        referralSources: [],
        interests: []
      }
    };

    return NextResponse.json(mockResponse, { status: 200 });
  } catch (error: any) {
    console.error('Get onboarding error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
