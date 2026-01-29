import { NextRequest, NextResponse } from 'next/server';
import { getStrategies, createStrategy } from '@/lib/notion';

export async function GET() {
  try {
    const strategies = await getStrategies();
    return NextResponse.json({ success: true, data: strategies });
  } catch (error) {
    console.error('Failed to fetch strategies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch strategies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await createStrategy({
      name: body.name,
      icon: body.icon || '🎯',
      description: body.description || '',
      systemPrompt: body.systemPrompt || '',
      emotionGoal: body.emotionGoal || '',
      persona: body.persona || '',
      isDefault: body.isDefault ?? false,
    });
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Failed to create strategy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create strategy' },
      { status: 500 }
    );
  }
}
