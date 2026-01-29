import { NextRequest, NextResponse } from 'next/server';
import { getMaterials, createMaterial } from '@/lib/notion';

export async function GET() {
  try {
    const materials = await getMaterials();
    return NextResponse.json({ success: true, data: materials });
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await createMaterial({
      title: body.title,
      type: body.type || '기타',
      url: body.url || '',
      description: body.description || '',
      keywords: body.keywords || [],
      useCount: 0,
    });
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Failed to create material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create material' },
      { status: 500 }
    );
  }
}
