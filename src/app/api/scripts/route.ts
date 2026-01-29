import { NextRequest, NextResponse } from 'next/server';
import { getScripts, createScript } from '@/lib/notion';

export async function GET() {
  try {
    const scripts = await getScripts();
    return NextResponse.json({ success: true, data: scripts });
  } catch (error) {
    console.error('Failed to fetch scripts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scripts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await createScript({
      title: body.title,
      category: body.category || '기타',
      content: body.content || '',
      keywords: body.keywords || [],
      useCount: 0,
      isActive: body.isActive ?? true,
    });
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Failed to create script:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create script' },
      { status: 500 }
    );
  }
}
