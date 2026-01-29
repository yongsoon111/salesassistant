// 고객 관련 타입
export type CustomerStatus = '리드' | '상담중' | '제안' | '계약' | '해지';

export interface Customer {
  id: string;
  name: string;
  company: string;
  status: CustomerStatus;
  notes: string;
  createdAt: string;
  lastContact: string;
}

// 세일즈 단계 타입
export interface SalesStage {
  id: string;
  name: string;
  order: number;
  targetPerception: string; // 목표인식
  aiInstruction: string;    // AI지시
  keyQuestions?: string;    // 핵심질문
  transitionSignals?: string; // 전환신호
  warnings?: string;        // 주의사항
  isActive: boolean;
}

// 스크립트 타입
export interface Script {
  id: string;
  title: string;
  category: '인사' | '라포' | '가치제안' | '반론처리' | '클로징' | '기타';
  content: string;
  keywords: string[];
  useCount: number;
  isActive: boolean;
}

// 자료 타입
export interface Material {
  id: string;
  title: string;
  type: '포트폴리오' | '가격표' | '사례' | '계약서' | '기타';
  url: string;
  description: string;
  keywords: string[];
  useCount: number;
}

// 전략 타입
export interface Strategy {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  emotionGoal: string;
  persona: string;
  isDefault: boolean;
}

// AI 분석 결과 타입
export interface AnalysisResult {
  customerEmotion: string;
  currentStageOrder: number;
  currentStageName: string;
  canAdvance: boolean;
  nextStageName?: string;
  hiddenNeeds: string;
  suggestedResponses: SuggestedResponse[];
  suggestedQuestions: string[];
  stageStrategy: string;
  recommendedMaterials: string[];
  warnings: string[];
}

export interface SuggestedResponse {
  type: '공감' | '질문' | '가치제안' | '반론처리' | '클로징';
  text: string;
  explanation: string;
}

// 대화 분석 요청 타입
export interface AnalysisRequest {
  conversation: string;
  customerId?: string;
  strategyId?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 상황 기반 메시지 생성 타입
export interface GeneratedMessage {
  messages: Array<{
    type: '공감' | '제안' | '질문' | '클로징';
    text: string;
    tone: string; // 톤 설명
  }>;
  situationAnalysis: string; // 상황 분석
  recommendedApproach: string; // 추천 접근법
}

// 상황 메시지 생성 요청 타입
export interface SituationMessageRequest {
  situation: string;
  strategyId?: string;
  customerId?: string;
  productId?: string;
}

// 상품/서비스 타입
export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  priceRange: string;
  targetCustomer: string;
  isActive: boolean;
}
