import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/footer-settings/all`);
    const result = await response.json();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch footer settings' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
    
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}