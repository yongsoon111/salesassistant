# 세일즈 어시스턴트 기술 명세서 v2

## 1. 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│                    Next.js 14 (App Router)                   │
│                    Tailwind CSS + shadcn/ui                  │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│       Notion API        │     │       Gemini API        │
│      (데이터 저장)       │     │       (AI 분석)         │
├─────────────────────────┤     ├─────────────────────────┤
│ - 고객 CRM              │     │ - 감정 분석             │
│ - 스크립트              │     │ - 응답 생성             │
│ - 자료                  │     │                         │
│ - 세일즈 전략           │     │                         │
└─────────────────────────┘     └─────────────────────────┘
```

> Supabase 사용 안 함 - 대화 내용은 텍스트로 직접 붙여넣기

---

## 2. 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14.x | React 프레임워크 (App Router) |
| React | 18.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안정성 |
| Tailwind CSS | 3.x | 스타일링 |
| shadcn/ui | latest | UI 컴포넌트 |
| Lucide React | latest | 아이콘 |

### Backend / APIs
| 기술 | 용도 |
|------|------|
| Notion API | 데이터 저장 (CRM, 스크립트, 자료, 전략) |
| Gemini API | 감정 분석 + 응답 생성 |

### 배포
| 기술 | 용도 |
|------|------|
| Vercel | 프론트엔드 배포 |

---

## 3. 프로젝트 구조

```
sales-assistant/
├── app/
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 메인 작업 화면
│   ├── scripts/
│   │   └── page.tsx               # 스크립트 라이브러리
│   ├── materials/
│   │   └── page.tsx               # 자료 관리
│   ├── stages/
│   │   └── page.tsx               # 세일즈 단계 관리 (커스텀)
│   ├── strategy/
│   │   └── page.tsx               # 전략 설정
│   └── api/
│       ├── notion/
│       │   ├── customers/route.ts # 고객 조회
│       │   ├── scripts/route.ts   # 스크립트 조회
│       │   ├── materials/route.ts # 자료 조회
│       │   ├── stages/route.ts    # 세일즈 단계 CRUD
│       │   └── strategy/route.ts  # 전략 조회/저장
│       └── gemini/
│           └── analyze/route.ts   # AI 분석 API
├── components/
│   ├── ui/                        # shadcn/ui 컴포넌트
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── customer/
│   │   ├── CustomerPanel.tsx      # 고객 정보 패널
│   │   ├── CustomerSelector.tsx   # 고객 선택 드롭다운
│   │   └── CustomerCard.tsx       # 고객 정보 카드
│   ├── analysis/
│   │   ├── AnalysisPanel.tsx      # 대화 분석 패널
│   │   ├── ConversationInput.tsx  # 대화 텍스트 입력
│   │   ├── ContextSelector.tsx    # 맥락 선택
│   │   ├── EmotionBadge.tsx       # 감정 표시 뱃지
│   │   └── ResponseCard.tsx       # AI 응답 카드
│   ├── scripts/
│   │   ├── ScriptList.tsx
│   │   ├── ScriptCard.tsx
│   │   └── CategoryFilter.tsx
│   ├── materials/
│   │   ├── MaterialList.tsx
│   │   └── MaterialCard.tsx
│   ├── stages/
│   │   ├── StageList.tsx          # 세일즈 단계 목록
│   │   ├── StageCard.tsx          # 단계 카드 (드래그 가능)
│   │   ├── StageForm.tsx          # 단계 추가/수정 폼
│   │   └── CurrentStageIndicator.tsx  # 현재 단계 표시
│   └── strategy/
│       ├── StrategyForm.tsx       # 전략 설정 폼
│       └── PresetSelector.tsx     # 프리셋 선택
├── lib/
│   ├── notion/
│   │   ├── client.ts              # Notion 클라이언트
│   │   ├── customers.ts           # 고객 CRUD
│   │   ├── scripts.ts             # 스크립트 조회
│   │   ├── materials.ts           # 자료 조회
│   │   ├── stages.ts              # 세일즈 단계 CRUD
│   │   └── strategy.ts            # 전략 CRUD
│   ├── gemini/
│   │   ├── client.ts              # Gemini 클라이언트
│   │   ├── vision.ts              # OCR 기능
│   │   └── analyze.ts             # 감정 분석 + 응답 생성
│   ├── hooks/
│   │   ├── useCustomers.ts
│   │   ├── useScripts.ts
│   │   ├── useMaterials.ts
│   │   ├── useStages.ts           # 세일즈 단계 훅
│   │   ├── useStrategy.ts
│   │   └── useClipboard.ts
│   └── utils/
│       ├── clipboard.ts
│       └── format.ts
├── types/
│   ├── customer.ts
│   ├── script.ts
│   ├── material.ts
│   ├── stage.ts                   # 세일즈 단계 타입
│   ├── strategy.ts
│   └── analysis.ts
├── prompts/
│   └── sales-analysis.ts          # AI 프롬프트 템플릿
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 4. 환경 변수

```env
# .env.local

# Notion
NOTION_API_KEY=secret_xxx
NOTION_CUSTOMER_DB_ID=xxx
NOTION_SCRIPT_DB_ID=xxx
NOTION_MATERIAL_DB_ID=xxx
NOTION_STAGE_DB_ID=xxx
NOTION_STRATEGY_DB_ID=xxx

# Gemini
GEMINI_API_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. API 설계

### 5.1 Notion API 연동

#### 고객 목록 조회
```typescript
// lib/notion/customers.ts

import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getCustomers(search?: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CUSTOMER_DB_ID!,
    filter: search ? {
      property: '업장명',
      title: { contains: search }
    } : undefined,
    sorts: [{ property: '최근연락일', direction: 'descending' }]
  });

  return response.results.map(parseCustomer);
}

export async function getCustomer(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return parseCustomer(page);
}

function parseCustomer(page: any): Customer {
  return {
    id: page.id,
    name: page.properties['업장명'].title[0]?.plain_text || '',
    contact: page.properties['담당자'].rich_text[0]?.plain_text || '',
    phone: page.properties['연락처'].phone_number || '',
    email: page.properties['이메일'].email || '',
    status: page.properties['상태'].select?.name || '',
    memo: page.properties['상담메모'].rich_text[0]?.plain_text || '',
    nextAction: page.properties['다음액션'].rich_text[0]?.plain_text || '',
    lastContact: page.properties['최근연락일'].date?.start || '',
    notionUrl: page.url,
  };
}
```

#### 스크립트 조회
```typescript
// lib/notion/scripts.ts

export async function getScripts(category?: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_SCRIPT_DB_ID!,
    filter: category ? {
      property: '카테고리',
      select: { equals: category }
    } : undefined,
    sorts: [{ property: '사용빈도', direction: 'descending' }]
  });

  return response.results.map(parseScript);
}

function parseScript(page: any): Script {
  return {
    id: page.id,
    title: page.properties['제목'].title[0]?.plain_text || '',
    category: page.properties['카테고리'].select?.name || '',
    content: page.properties['내용'].rich_text[0]?.plain_text || '',
    tags: page.properties['태그'].multi_select.map((t: any) => t.name),
    useCount: page.properties['사용빈도'].number || 0,
    notionUrl: page.url,
  };
}
```

#### 세일즈 단계 조회/관리 (커스텀 가능)
```typescript
// lib/notion/stages.ts

export async function getStages() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_STAGE_DB_ID!,
    filter: {
      property: '활성화',
      checkbox: { equals: true }
    },
    sorts: [{ property: '순서', direction: 'ascending' }]
  });

  return response.results.map(parseStage);
}

export async function createStage(data: Partial<SalesStage>) {
  const response = await notion.pages.create({
    parent: { database_id: process.env.NOTION_STAGE_DB_ID! },
    properties: {
      '단계명': { title: [{ text: { content: data.name || '' } }] },
      '순서': { number: data.order || 0 },
      '목표인식': { rich_text: [{ text: { content: data.targetPerception || '' } }] },
      'AI지시': { rich_text: [{ text: { content: data.aiInstruction || '' } }] },
      '핵심질문': { rich_text: [{ text: { content: data.keyQuestions || '' } }] },
      '전환신호': { rich_text: [{ text: { content: data.transitionSignal || '' } }] },
      '주의사항': { rich_text: [{ text: { content: data.caution || '' } }] },
      '활성화': { checkbox: true },
    }
  });
  return parseStage(response);
}

export async function updateStage(pageId: string, data: Partial<SalesStage>) {
  // Notion API로 페이지 업데이트
}

export async function deleteStage(pageId: string) {
  // 활성화 체크박스를 false로 변경 (soft delete)
}

function parseStage(page: any): SalesStage {
  return {
    id: page.id,
    name: page.properties['단계명'].title[0]?.plain_text || '',
    order: page.properties['순서'].number || 0,
    targetPerception: page.properties['목표인식'].rich_text[0]?.plain_text || '',
    aiInstruction: page.properties['AI지시'].rich_text[0]?.plain_text || '',
    keyQuestions: page.properties['핵심질문'].rich_text[0]?.plain_text || '',
    transitionSignal: page.properties['전환신호'].rich_text[0]?.plain_text || '',
    caution: page.properties['주의사항'].rich_text[0]?.plain_text || '',
    isActive: page.properties['활성화'].checkbox || false,
    notionUrl: page.url,
  };
}
```

#### 세일즈 전략 조회/저장
```typescript
// lib/notion/strategy.ts

export async function getStrategies() {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_STRATEGY_DB_ID!,
  });

  return response.results.map(parseStrategy);
}

export async function getStrategy(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return parseStrategy(page);
}

function parseStrategy(page: any): Strategy {
  return {
    id: page.id,
    name: page.properties['전략명'].title[0]?.plain_text || '',
    persona: page.properties['페르소나'].rich_text[0]?.plain_text || '',
    restrictions: page.properties['금지사항'].rich_text[0]?.plain_text || '',
    systemPrompt: page.properties['시스템프롬프트'].rich_text[0]?.plain_text || '',
  };
}
```

---

### 5.2 Gemini API 연동

#### 대화 분석 + 응답 생성
```typescript
// lib/gemini/analyze.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface AnalysisInput {
  conversationText: string;  // 붙여넣기한 대화 텍스트
  customer: Customer;
  stages: SalesStage[];      // 모든 세일즈 단계 (커스텀 포함)
  strategy: Strategy;        // 전체 톤/스타일
  context?: string;
}

interface AnalysisResult {
  currentStage: SalesStage;      // 현재 단계 (자동 감지)
  currentEmotion: string;        // 현재 고객 감정
  emotionSignals: string[];      // 감정 판단 근거
  nextStage?: SalesStage;        // 다음 단계 (전환 가능 시)
  stageStrategy: string;         // 현재 단계 전략 설명
  suggestedResponse: string;     // 추천 멘트
  suggestedQuestions: string[];  // 추천 질문들
  relatedScripts: string[];      // 관련 스크립트 키워드
}

export async function analyzeConversation(input: AnalysisInput): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = buildAnalysisPrompt(input);

  const result = await model.generateContent(prompt);

  const response = result.response.text();
  return parseAnalysisResponse(response);
}

function buildAnalysisPrompt(input: AnalysisInput): string {
  // 세일즈 단계 정보를 텍스트로 변환
  const stagesText = input.stages.map(s =>
    `${s.order}. ${s.name}
   - 목표인식: "${s.targetPerception}"
   - AI지시: ${s.aiInstruction}
   - 핵심질문: ${s.keyQuestions || '없음'}
   - 전환신호: ${s.transitionSignal || '없음'}
   - 주의사항: ${s.caution || '없음'}`
  ).join('\n\n');

  return `
[역할]
당신은 세일즈 심리 전문가입니다.
고객과의 대화 내용을 분석하고, 현재 세일즈 단계를 파악하여 전략적 응답을 제안합니다.

[세일즈 단계 프레임워크]
아래 단계들 중 현재 어떤 단계인지 파악하세요:

${stagesText}

[전체 세일즈 톤/스타일]
- 페르소나: ${input.strategy.persona}
- 금지 사항: ${input.strategy.restrictions}

${input.strategy.systemPrompt ? `[추가 지시]\n${input.strategy.systemPrompt}` : ''}

[고객 정보]
- 업장: ${input.customer.name}
- 담당자: ${input.customer.contact}
- 상태: ${input.customer.status}
- 히스토리: ${input.customer.memo}

[대화 내용]
${input.conversationText}

${input.context ? `[추가 맥락]\n${input.context}` : ''}

[분석 요청]
1. 현재 어떤 세일즈 단계인지 파악하세요
2. 고객의 현재 감정 상태를 분석하세요
3. 해당 단계의 목표 인식을 달성하기 위한 전략을 세우세요
4. 다음 단계로 넘어갈 수 있는지 판단하세요
5. 구체적인 응답 멘트와 질문을 작성하세요

[출력 형식 - 반드시 JSON으로]
{
  "currentStageName": "현재 단계 이름 (위 단계 목록에서)",
  "currentStageOrder": 현재 단계 순서 번호,
  "currentEmotion": "고객 감정 상태 (예: 망설임, 관심, 의심 등)",
  "emotionSignals": ["감정을 판단한 근거 1", "근거 2"],
  "canAdvance": true/false,
  "nextStageName": "다음 단계 이름 (전환 가능 시)",
  "stageStrategy": "현재 단계에서의 전략 설명 (2-3문장)",
  "suggestedResponse": "추천 멘트 (실제 보낼 수 있는 메시지)",
  "suggestedQuestions": ["추천 질문 1", "추천 질문 2"],
  "relatedScripts": ["검색할 스크립트 키워드 1", "키워드 2"]
}
`;
}

function parseAnalysisResponse(response: string): AnalysisResult {
  // JSON 파싱
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]);
}
```

---

## 6. 주요 컴포넌트 명세

### 6.1 CustomerPanel

```typescript
// components/customer/CustomerPanel.tsx

interface CustomerPanelProps {
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer) => void;
}

// 기능:
// - 고객 검색/선택 드롭다운
// - 선택된 고객 정보 카드 표시
// - Notion에서 보기 링크
// - 상담 메모, 다음 액션 표시
```

### 6.2 AnalysisPanel

```typescript
// components/analysis/AnalysisPanel.tsx

interface AnalysisPanelProps {
  customer: Customer | null;
  strategy: Strategy;
  onAnalysisComplete: (result: AnalysisResult) => void;
}

// 기능:
// - 대화 텍스트 입력 (붙여넣기)
// - 맥락 선택 (첫 상담, 가격 논의 등)
// - 분석 버튼 → AI 호출
// - 분석 결과 표시 (감정, 전략, 멘트)
// - 멘트 복사/수정
```

### 6.3 ConversationInput

```typescript
// components/analysis/ConversationInput.tsx

interface ConversationInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

// 기능:
// - 큰 텍스트 입력창
// - 붙여넣기 지원
// - 글자 수 표시
// - 클리어 버튼
```

### 6.4 ResponseCard

```typescript
// components/analysis/ResponseCard.tsx

interface ResponseCardProps {
  result: AnalysisResult;
  onCopy: () => void;
  onEdit: (edited: string) => void;
}

// 기능:
// - 감정 분석 결과 (뱃지)
// - 전략 제안 표시
// - 추천 멘트 표시
// - 복사 버튼
// - 수정 모드 (텍스트 편집 후 복사)
```

### 6.5 EmotionBadge

```typescript
// components/analysis/EmotionBadge.tsx

interface EmotionBadgeProps {
  emotion: string;
  signals?: string[];
}

// 감정별 색상:
// - 관심/기대: 녹색
// - 탐색/정보수집: 파란색
// - 망설임: 노란색
// - 의심/저항: 주황색
// - 이탈: 빨간색
```

---

## 7. 타입 정의

```typescript
// types/customer.ts
export interface Customer {
  id: string;
  name: string;           // 업장명
  contact: string;        // 담당자
  phone: string;          // 연락처
  email: string;          // 이메일
  status: string;         // 상태 (리드/상담중/계약완료/이탈)
  memo: string;           // 상담메모
  nextAction: string;     // 다음액션
  lastContact: string;    // 최근연락일
  notionUrl: string;      // Notion 페이지 URL
}

// types/script.ts
export interface Script {
  id: string;
  title: string;          // 제목
  category: string;       // 카테고리
  content: string;        // 내용
  tags: string[];         // 태그
  useCount: number;       // 사용빈도
  notionUrl: string;      // Notion 페이지 URL
}

// types/material.ts
export interface Material {
  id: string;
  title: string;          // 자료명
  category: string;       // 카테고리
  url: string;            // 링크
  description: string;    // 설명
  notionUrl: string;      // Notion 페이지 URL
}

// types/stage.ts
export interface SalesStage {
  id: string;
  name: string;                 // 단계명
  order: number;                // 순서
  targetPerception: string;     // 목표인식
  aiInstruction: string;        // AI지시
  keyQuestions?: string;        // 핵심질문
  transitionSignal?: string;    // 전환신호
  caution?: string;             // 주의사항
  isActive: boolean;            // 활성화 여부
  notionUrl: string;            // Notion URL
}

// types/strategy.ts
export interface Strategy {
  id: string;
  name: string;                 // 전략명
  persona: string;              // 페르소나
  restrictions: string;         // 금지사항
  systemPrompt: string;         // 시스템프롬프트
}

// types/analysis.ts
export interface AnalysisResult {
  currentStageName: string;     // 현재 단계명
  currentStageOrder: number;    // 현재 단계 순서
  currentEmotion: string;       // 현재 고객 감정
  emotionSignals: string[];     // 감정 판단 근거
  canAdvance: boolean;          // 다음 단계 전환 가능 여부
  nextStageName?: string;       // 다음 단계명
  stageStrategy: string;        // 현재 단계 전략 설명
  suggestedResponse: string;    // 추천 멘트
  suggestedQuestions: string[]; // 추천 질문들
  relatedScripts: string[];     // 관련 스크립트 키워드
}
```

---

## 8. AI 프롬프트 관리

```typescript
// prompts/sales-analysis.ts

// 감정 카테고리 (고정)
export const EMOTION_CATEGORIES = {
  positive: ['관심', '기대', '신뢰', '결정', '만족'],
  neutral: ['탐색', '정보수집', '비교'],
  negative: ['의심', '저항', '무관심', '망설임', '이탈'],
};

// 세일즈 단계는 Notion DB에서 동적으로 가져옴 (커스텀 가능)
// getStages() 함수 사용

// 맥락 옵션 (선택적 추가 정보)
export const CONTEXT_OPTIONS = [
  { value: 'first_contact', label: '첫 상담이에요' },
  { value: 'showing_interest', label: '관심 보이고 있어요' },
  { value: 'asking_price', label: '가격 얘기 나왔어요' },
  { value: 'objection', label: '반대/거절 의사 표현' },
  { value: 'almost_closing', label: '거의 결정 단계예요' },
  { value: 'competitor_mention', label: '경쟁사 언급했어요' },
  { value: 'follow_up', label: '계약 후 팔로업' },
];
```

---

## 9. 반응형 디자인

```typescript
// Tailwind breakpoints 활용

// 모바일 (< 768px):
// - 단일 컬럼
// - 고객 패널과 분석 패널 탭으로 전환
// - 하단 네비게이션

// 태블릿 (768px ~):
// - 2컬럼 (고객 패널 + 분석 패널)
// - 사이드 네비게이션

// 데스크톱 (1024px ~):
// - 고정 사이드바 + 넓은 메인
```

---

## 10. 성능 최적화

### 데이터 캐싱
- Notion 데이터: SWR/React Query로 캐싱
- 전략 설정: localStorage에 마지막 사용 전략 저장

### 이미지 처리
- 업로드 전 리사이징 (max 1920px)
- WebP 변환 고려
- Base64 변환은 클라이언트에서

### API 호출 최적화
- Notion API: 필요한 속성만 요청
- Gemini: 스트리밍 응답 고려

---

## 11. 보안

### API 키 관리
- 모든 API 키는 서버 사이드에서만 사용
- `NEXT_PUBLIC_` prefix는 Supabase anon key만

### 파일 업로드
- 이미지 파일만 허용 (image/*)
- 최대 크기 10MB

---

## 12. 배포 체크리스트

### Vercel 배포
- [ ] GitHub 연동
- [ ] 환경 변수 설정 (Notion, Gemini)
- [ ] 도메인 연결 (선택)

### Notion 설정
- [ ] Integration 생성 및 API 키 발급
- [ ] 각 DB에 Integration 연결
- [ ] DB ID 확인

### Gemini 설정
- [ ] API 키 발급 (Google AI Studio)

---

## 13. 개발 명령어

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start

# 타입 체크
npm run type-check

# 린트
npm run lint
```

---

## 14. 주요 의존성

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@notionhq/client": "^2.2.0",
    "@google/generative-ai": "^0.1.0",
    "swr": "^2.0.0",
    "tailwindcss": "^3.0.0",
    "lucide-react": "^0.300.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/node": "^20.0.0"
  }
}
```
