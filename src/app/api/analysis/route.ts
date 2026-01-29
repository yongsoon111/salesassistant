import { NextRequest, NextResponse } from 'next/server';
import { analyzeConversation, generateQuickResponse } from '@/lib/gemini';
import { getStages, getStrategy, getCustomer } from '@/lib/notion';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation, customerId, strategyId, quickResponse } = body;

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation is required' },
        { status: 400 }
      );
    }

    // Quick response mode
    if (quickResponse) {
      const response = await generateQuickResponse(
        conversation,
        quickResponse.type,
        quickResponse.context
      );
      return NextResponse.json({ success: true, data: { response } });
    }

    // Full analysis mode
    const stages = await getStages();
    const strategy = strategyId ? await getStrategy(strategyId) : undefined;
    const customer = customerId ? await getCustomer(customerId) : undefined;

    const analysis = await analyzeConversation({
      conversation,
      stages,
      strategy: strategy || undefined,
      customer: customer || undefined,
    });

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('Failed to analyze conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze conversation' },
      { status: 500 }
    );
  }
}
