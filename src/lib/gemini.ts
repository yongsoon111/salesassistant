import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AnalysisResult, SalesStage, Strategy, Customer, GeneratedMessage, Product } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface AnalyzeConversationParams {
  conversation: string;
  stages: SalesStage[];
  strategy?: Strategy;
  customer?: Customer;
}

export async function analyzeConversation({
  conversation,
  stages,
  strategy,
  customer,
}: AnalyzeConversationParams): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const stagesContext = stages
    .map((s) => `${s.order}. ${s.name}: 목표인식="${s.targetPerception}", AI지시="${s.aiInstruction}"`)
    .join('\n');

  const strategyContext = strategy
    ? `전략: ${strategy.name}\n감정목표: ${strategy.emotionGoal}\n페르소나: ${strategy.persona}`
    : '기본 세일즈 전략 적용';

  const customerContext = customer
    ? `고객: ${customer.name} (${customer.company})\n상태: ${customer.status}\n메모: ${customer.notes}`
    : '신규 고객';

  const prompt = `당신은 세일즈 심리학 전문가입니다. 아래 대화를 분석해주세요.

=== 세일즈 단계 프레임워크 ===
${stagesContext}

=== 전략 정보 ===
${strategyContext}

=== 고객 정보 ===
${customerContext}

=== 대화 내용 ===
${conversation}

=== 분석 요청 ===
다음 JSON 형식으로 분석 결과를 제공해주세요:

{
  "customerEmotion": "고객의 현재 감정 상태",
  "currentStageOrder": 현재_단계_순서_숫자,
  "currentStageName": "현재 단계 이름",
  "canAdvance": 다음_단계로_넘어갈_수_있는지_boolean,
  "nextStageName": "다음 단계 이름 (있는 경우)",
  "hiddenNeeds": "파악된 숨은 니즈",
  "suggestedResponses": [
    {
      "type": "공감|질문|가치제안|반론처리|클로징",
      "text": "추천 응답 텍스트",
      "explanation": "이 응답을 추천하는 이유"
    }
  ],
  "suggestedQuestions": ["이 단계에서 던질 질문들"],
  "stageStrategy": "현재 단계에서의 전략 조언",
  "recommendedMaterials": ["추천 자료 유형"],
  "warnings": ["주의해야 할 사항"]
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid AI response format');
  }

  return JSON.parse(jsonMatch[0]) as AnalysisResult;
}

export async function generateQuickResponse(
  conversation: string,
  responseType: string,
  context?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `세일즈 상황입니다. 다음 유형의 응답을 생성해주세요.

응답 유형: ${responseType}
${context ? `맥락: ${context}` : ''}

대화 내용:
${conversation}

자연스럽고 설득력 있는 한국어 응답을 한 문장으로 제공해주세요. 응답만 작성하세요.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function generateMessageFromSituation(
  situation: string,
  strategyId?: string,
  customerId?: string,
  strategy?: Strategy,
  customer?: Customer,
  product?: Product
): Promise<GeneratedMessage> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const productContext = product
    ? `=== 판매 상품/서비스 정보 ===
상품명: ${product.name}
한줄설명: ${product.shortDescription}
상세설명: ${product.fullDescription}
핵심혜택: ${product.benefits.join(', ')}
가격대: ${product.priceRange}
타겟고객: ${product.targetCustomer}
`
    : '';

  const strategyContext = strategy
    ? `=== 전략 정보 ===
전략명: ${strategy.name}
설명: ${strategy.description}
감정목표: ${strategy.emotionGoal}
페르소나: ${strategy.persona}
시스템프롬프트: ${strategy.systemPrompt}
`
    : '';

  const customerContext = customer
    ? `=== 고객 정보 ===
고객명: ${customer.name}
회사: ${customer.company}
상태: ${customer.status}
메모: ${customer.notes}
최종연락일: ${customer.lastContact}
`
    : '';

  const prompt = `당신은 전문적인 세일즈 커뮤니케이션 전문가입니다.
현재 상황을 분석하고 효과적인 응대 메시지를 생성해주세요.

${productContext}
${strategyContext}
${customerContext}

=== 현재 상황 ===
${situation}

=== 요청사항 ===
위 상황을 분석하고, 세일즈 전문가로서 3개의 응대 메시지를 생성해주세요.
각 메시지는 다른 유형(공감, 제안, 질문, 클로징 중)이어야 하며,
자연스럽고 설득력 있는 한국어로 작성되어야 합니다.
${product ? `\n반드시 위 상품/서비스 정보를 활용하여 구체적인 메시지를 생성하세요. 플레이스홀더([상품명] 등)를 사용하지 말고 실제 상품명과 혜택을 직접 언급하세요.` : ''}

다음 JSON 형식으로 응답해주세요:

{
  "situationAnalysis": "상황에 대한 전문적인 분석 (2-3문장)",
  "recommendedApproach": "추천하는 접근 방법 (2-3문장)",
  "messages": [
    {
      "type": "공감|제안|질문|클로징",
      "text": "실제 사용할 메시지 텍스트 (자연스러운 한국어, 2-3문장)",
      "tone": "이 메시지의 톤과 의도 설명 (1문장)"
    },
    {
      "type": "공감|제안|질문|클로징",
      "text": "실제 사용할 메시지 텍스트 (자연스러운 한국어, 2-3문장)",
      "tone": "이 메시지의 톤과 의도 설명 (1문장)"
    },
    {
      "type": "공감|제안|질문|클로징",
      "text": "실제 사용할 메시지 텍스트 (자연스러운 한국어, 2-3문장)",
      "tone": "이 메시지의 톤과 의도 설명 (1문장)"
    }
  ]
}

JSON만 반환하고 다른 텍스트는 포함하지 마세요.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid AI response format');
  }

  return JSON.parse(jsonMatch[0]) as GeneratedMessage;
}
