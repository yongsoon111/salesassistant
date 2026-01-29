import { NextRequest, NextResponse } from 'next/server';
import { getStages, createStage } from '@/lib/notion';

export async function GET() {
  try {
    const stages = await getStages();
    return NextResponse.json({ success: true, data: stages });
  } catch (error) {
    console.error('Failed to fetch stages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await createStage({
      name: body.name,
      order: body.order,
      targetPerception: body.targetPerception,
      aiInstruction: body.aiInstruction,
      keyQuestions: body.keyQuestions || '',
      transitionSignals: body.transitionSignals || '',
      warnings: body.warnings || '',
      isActive: body.isActive ?? true,
    });
    return NextResponse.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Failed to create stage:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create stage' },
      { status: 500 }
    );
  }
}
