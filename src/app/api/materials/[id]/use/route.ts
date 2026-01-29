import { NextRequest, NextResponse } from 'next/server';
import { incrementMaterialUseCount } from '@/lib/notion';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await incrementMaterialUseCount(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to increment material use count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment use count' },
      { status: 500 }
    );
  }
}
