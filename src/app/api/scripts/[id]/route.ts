import { NextRequest, NextResponse } from 'next/server';
import { updateScript, deleteScript } from '@/lib/notion';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateScript(id, {
      title: body.title,
      category: body.category,
      content: body.content,
      keywords: body.keywords,
      isActive: body.isActive,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update script:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update script' },
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
    await deleteScript(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete script:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete script' },
      { status: 500 }
    );
  }
}
