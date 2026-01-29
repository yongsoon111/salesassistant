import { NextRequest, NextResponse } from 'next/server';
import { updateMaterial, deleteMaterial } from '@/lib/notion';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateMaterial(id, {
      title: body.title,
      type: body.type,
      url: body.url,
      description: body.description,
      keywords: body.keywords,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update material' },
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
    await deleteMaterial(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}
