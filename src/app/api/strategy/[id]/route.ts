import { NextRequest, NextResponse } from 'next/server';
import { updateStrategy, deleteStrategy } from '@/lib/notion';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateStrategy(id, {
      name: body.name,
      icon: body.icon,
      description: body.description,
      systemPrompt: body.systemPrompt,
      emotionGoal: body.emotionGoal,
      persona: body.persona,
      isDefault: body.isDefault,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update strategy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update strategy' },
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
    await deleteStrategy(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete strategy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete strategy' },
      { status: 500 }
    );
  }
}
