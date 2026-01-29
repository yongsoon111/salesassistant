import { NextRequest, NextResponse } from 'next/server';
import { updateStage, deleteStage } from '@/lib/notion';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateStage(id, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update stage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update stage' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteStage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete stage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete stage' },
      { status: 500 }
    );
  }
}
