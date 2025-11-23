import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Fetch all dynamic pages from backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/dynamic-pages/`);
    const result = await response.json();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to fetch pages' },
        { status: 500 }
      );
    }
    
    // Find page by slug
    const page = result.data.find((page: { slug: string; isActive: boolean }) => page.slug === slug && page.isActive);
    
    if (!page) {
      return NextResponse.json(
        { success: false, message: 'Page not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Page found',
      data: page
    });
    
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}