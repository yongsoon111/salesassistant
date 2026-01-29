import { NextRequest, NextResponse } from 'next/server';
import { generateMessageFromSituation } from '@/lib/gemini';
import { getStrategy, getCustomer, getProduct } from '@/lib/notion';
import type { Strategy, Customer, Product } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { situation, strategyId, customerId, productId } = body;

    // 필수 파라미터 검증
    if (!situation || typeof situation !== 'string') {
      return NextResponse.json(
        { success: false, error: '상황(situation)은 필수 입력값입니다.' },
        { status: 400 }
      );
    }

    // 전략, 고객, 상품 정보 조회
    let strategy: Strategy | null = null;
    let customer: Customer | null = null;
    let product: Product | null = null;

    try {
      if (strategyId) {
        strategy = await getStrategy(strategyId);
      }
      if (customerId) {
        customer = await getCustomer(customerId);
      }
      if (productId) {
        product = await getProduct(productId);
      }
    } catch (error) {
      console.error('노션 데이터 조회 오류:', error);
      // 노션 데이터 조회 실패해도 계속 진행 (선택적 데이터)
    }

    // 메시지 생성
    const result = await generateMessageFromSituation(
      situation,
      strategyId,
      customerId,
      strategy || undefined,
      customer || undefined,
      product || undefined
    );

    // 응답 형식을 useSituationMessage 훅이 기대하는 형식으로 변환
    const response = {
      situation,
      analysis: result.situationAnalysis,
      approach: result.recommendedApproach,
      messages: result.messages.map((msg) => ({
        type: msg.type as '공감' | '질문' | '가치제안' | '반론처리' | '클로징',
        text: msg.text,
        explanation: msg.tone,
      })),
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error('메시지 생성 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '메시지 생성 중 오류가 발생했습니다.',
      },
      { status: 500 }
    );
  }
}
