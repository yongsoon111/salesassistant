import { NextRequest, NextResponse } from 'next/server';
import { incrementScriptUseCount } from '@/lib/notion';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await incrementScriptUseCount(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to increment script use count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment use count' },
      { status: 500 }
    );
  }
}
