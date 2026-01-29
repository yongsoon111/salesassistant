import { Client } from '@notionhq/client';
import type { Customer, Script, Material, SalesStage, Strategy, Product } from '@/types';

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// Database IDs
const CUSTOMER_DB_ID = process.env.NOTION_CUSTOMER_DB_ID!;
const SCRIPT_DB_ID = process.env.NOTION_SCRIPT_DB_ID!;
const MATERIAL_DB_ID = process.env.NOTION_MATERIAL_DB_ID!;
const STAGE_DB_ID = process.env.NOTION_STAGE_DB_ID!;
const STRATEGY_DB_ID = process.env.NOTION_STRATEGY_DB_ID!;
const PRODUCT_DB_ID = process.env.NOTION_PRODUCT_DB_ID!;

// ============ 고객 관련 함수 ============
export async function getCustomers(): Promise<Customer[]> {
  const response = await notion.databases.query({
    database_id: CUSTOMER_DB_ID,
    sorts: [{ property: '최종연락일', direction: 'descending' }],
  });

  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties['고객명']?.title?.[0]?.plain_text || '',
    company: page.properties['회사명']?.rich_text?.[0]?.plain_text || '',
    status: page.properties['상태']?.select?.name || '리드',
    notes: page.properties['메모']?.rich_text?.[0]?.plain_text || '',
    createdAt: page.properties['등록일']?.date?.start || '',
    lastContact: page.properties['최종연락일']?.date?.start || '',
  }));
}

export async function getCustomer(id: string): Promise<Customer | null> {
  const page: any = await notion.pages.retrieve({ page_id: id });

  return {
    id: page.id,
    name: page.properties['고객명']?.title?.[0]?.plain_text || '',
    company: page.properties['회사명']?.rich_text?.[0]?.plain_text || '',
    status: page.properties['상태']?.select?.name || '리드',
    notes: page.properties['메모']?.rich_text?.[0]?.plain_text || '',
    createdAt: page.properties['등록일']?.date?.start || '',
    lastContact: page.properties['최종연락일']?.date?.start || '',
  };
}

export async function createCustomer(data: Omit<Customer, 'id'>): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: CUSTOMER_DB_ID },
    properties: {
      '고객명': { title: [{ text: { content: data.name } }] },
      '회사명': { rich_text: [{ text: { content: data.company } }] },
      '상태': { select: { name: data.status } },
      '메모': { rich_text: [{ text: { content: data.notes } }] },
      '등록일': { date: { start: data.createdAt } },
      '최종연락일': { date: { start: data.lastContact } },
    },
  });
  return response.id;
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
  const properties: Record<string, any> = {};

  if (data.name) properties['고객명'] = { title: [{ text: { content: data.name } }] };
  if (data.company) properties['회사명'] = { rich_text: [{ text: { content: data.company } }] };
  if (data.status) properties['상태'] = { select: { name: data.status } };
  if (data.notes !== undefined) properties['메모'] = { rich_text: [{ text: { content: data.notes } }] };
  if (data.lastContact) properties['최종연락일'] = { date: { start: data.lastContact } };

  await notion.pages.update({ page_id: id, properties });
}

export async function deleteCustomer(id: string): Promise<void> {
  await notion.pages.update({ page_id: id, archived: true });
}

// ============ 스크립트 관련 함수 ============
export async function getScripts(): Promise<Script[]> {
  const response = await notion.databases.query({
    database_id: SCRIPT_DB_ID,
    filter: { property: '활성화', checkbox: { equals: true } },
    sorts: [{ property: '사용횟수', direction: 'descending' }],
  });

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties['제목']?.title?.[0]?.plain_text || '',
    category: page.properties['카테고리']?.select?.name || '기타',
    content: page.properties['내용']?.rich_text?.[0]?.plain_text || '',
    keywords: page.properties['키워드']?.multi_select?.map((k: any) => k.name) || [],
    useCount: page.properties['사용횟수']?.number || 0,
    isActive: page.properties['활성화']?.checkbox || false,
  }));
}

export async function incrementScriptUseCount(id: string): Promise<void> {
  const page: any = await notion.pages.retrieve({ page_id: id });
  const currentCount = page.properties['사용횟수']?.number || 0;

  await notion.pages.update({
    page_id: id,
    properties: { '사용횟수': { number: currentCount + 1 } },
  });
}

export async function createScript(data: Omit<Script, 'id'>): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: SCRIPT_DB_ID },
    properties: {
      '제목': { title: [{ text: { content: data.title } }] },
      '카테고리': { select: { name: data.category } },
      '내용': { rich_text: [{ text: { content: data.content } }] },
      '키워드': { multi_select: data.keywords.map(k => ({ name: k })) },
      '사용횟수': { number: data.useCount || 0 },
      '활성화': { checkbox: data.isActive ?? true },
    },
  });
  return response.id;
}

export async function updateScript(id: string, data: Partial<Script>): Promise<void> {
  const properties: Record<string, any> = {};

  if (data.title) properties['제목'] = { title: [{ text: { content: data.title } }] };
  if (data.category) properties['카테고리'] = { select: { name: data.category } };
  if (data.content !== undefined) properties['내용'] = { rich_text: [{ text: { content: data.content } }] };
  if (data.keywords) properties['키워드'] = { multi_select: data.keywords.map(k => ({ name: k })) };
  if (data.isActive !== undefined) properties['활성화'] = { checkbox: data.isActive };

  await notion.pages.update({ page_id: id, properties });
}

export async function deleteScript(id: string): Promise<void> {
  await notion.pages.update({
    page_id: id,
    archived: true,
  });
}

// ============ 자료 관련 함수 ============
export async function getMaterials(): Promise<Material[]> {
  const response = await notion.databases.query({
    database_id: MATERIAL_DB_ID,
    sorts: [{ property: '사용횟수', direction: 'descending' }],
  });

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties['자료명']?.title?.[0]?.plain_text || '',
    type: page.properties['유형']?.select?.name || '기타',
    url: page.properties['URL']?.url || '',
    description: page.properties['설명']?.rich_text?.[0]?.plain_text || '',
    keywords: page.properties['키워드']?.multi_select?.map((k: any) => k.name) || [],
    useCount: page.properties['사용횟수']?.number || 0,
  }));
}

export async function incrementMaterialUseCount(id: string): Promise<void> {
  const page: any = await notion.pages.retrieve({ page_id: id });
  const currentCount = page.properties['사용횟수']?.number || 0;

  await notion.pages.update({
    page_id: id,
    properties: { '사용횟수': { number: currentCount + 1 } },
  });
}

export async function createMaterial(data: Omit<Material, 'id'>): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: MATERIAL_DB_ID },
    properties: {
      '자료명': { title: [{ text: { content: data.title } }] },
      '유형': { select: { name: data.type } },
      'URL': { url: data.url || null },
      '설명': { rich_text: [{ text: { content: data.description || '' } }] },
      '키워드': { multi_select: data.keywords.map(k => ({ name: k })) },
      '사용횟수': { number: data.useCount || 0 },
    },
  });
  return response.id;
}

export async function updateMaterial(id: string, data: Partial<Material>): Promise<void> {
  const properties: Record<string, any> = {};

  if (data.title) properties['자료명'] = { title: [{ text: { content: data.title } }] };
  if (data.type) properties['유형'] = { select: { name: data.type } };
  if (data.url !== undefined) properties['URL'] = { url: data.url || null };
  if (data.description !== undefined) properties['설명'] = { rich_text: [{ text: { content: data.description } }] };
  if (data.keywords) properties['키워드'] = { multi_select: data.keywords.map(k => ({ name: k })) };

  await notion.pages.update({ page_id: id, properties });
}

export async function deleteMaterial(id: string): Promise<void> {
  await notion.pages.update({
    page_id: id,
    archived: true,
  });
}

// ============ 세일즈 단계 관련 함수 ============
export async function getStages(): Promise<SalesStage[]> {
  const response = await notion.databases.query({
    database_id: STAGE_DB_ID,
    filter: { property: '활성화', checkbox: { equals: true } },
    sorts: [{ property: '순서', direction: 'ascending' }],
  });

  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties['단계명']?.title?.[0]?.plain_text || '',
    order: page.properties['순서']?.number || 0,
    targetPerception: page.properties['목표인식']?.rich_text?.[0]?.plain_text || '',
    aiInstruction: page.properties['AI지시']?.rich_text?.[0]?.plain_text || '',
    keyQuestions: page.properties['핵심질문']?.rich_text?.[0]?.plain_text || '',
    transitionSignals: page.properties['전환신호']?.rich_text?.[0]?.plain_text || '',
    warnings: page.properties['주의사항']?.rich_text?.[0]?.plain_text || '',
    isActive: page.properties['활성화']?.checkbox || false,
  }));
}

export async function createStage(data: Omit<SalesStage, 'id'>): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: STAGE_DB_ID },
    properties: {
      '단계명': { title: [{ text: { content: data.name } }] },
      '순서': { number: data.order },
      '목표인식': { rich_text: [{ text: { content: data.targetPerception } }] },
      'AI지시': { rich_text: [{ text: { content: data.aiInstruction } }] },
      '핵심질문': { rich_text: [{ text: { content: data.keyQuestions || '' } }] },
      '전환신호': { rich_text: [{ text: { content: data.transitionSignals || '' } }] },
      '주의사항': { rich_text: [{ text: { content: data.warnings || '' } }] },
      '활성화': { checkbox: data.isActive },
    },
  });
  return response.id;
}

export async function updateStage(id: string, data: Partial<SalesStage>): Promise<void> {
  const properties: Record<string, any> = {};

  if (data.name) properties['단계명'] = { title: [{ text: { content: data.name } }] };
  if (data.order !== undefined) properties['순서'] = { number: data.order };
  if (data.targetPerception) properties['목표인식'] = { rich_text: [{ text: { content: data.targetPerception } }] };
  if (data.aiInstruction) properties['AI지시'] = { rich_text: [{ text: { content: data.aiInstruction } }] };
  if (data.keyQuestions !== undefined) properties['핵심질문'] = { rich_text: [{ text: { content: data.keyQuestions } }] };
  if (data.transitionSignals !== undefined) properties['전환신호'] = { rich_text: [{ text: { content: data.transitionSignals } }] };
  if (data.warnings !== undefined) properties['주의사항'] = { rich_text: [{ text: { content: data.warnings } }] };
  if (data.isActive !== undefined) properties['활성화'] = { checkbox: data.isActive };

  await notion.pages.update({ page_id: id, properties });
}

export async function deleteStage(id: string): Promise<void> {
  await notion.pages.update({
    page_id: id,
    archived: true,
  });
}

// ============ 전략 관련 함수 ============
export async function getStrategies(): Promise<Strategy[]> {
  const response = await notion.databases.query({
    database_id: STRATEGY_DB_ID,
    sorts: [{ property: '기본전략', direction: 'descending' }],
  });

  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties['전략명']?.title?.[0]?.plain_text || '',
    icon: page.properties['아이콘']?.rich_text?.[0]?.plain_text || '🎯',
    description: page.properties['설명']?.rich_text?.[0]?.plain_text || '',
    systemPrompt: page.properties['시스템프롬프트']?.rich_text?.[0]?.plain_text || '',
    emotionGoal: page.properties['감정목표']?.rich_text?.[0]?.plain_text || '',
    persona: page.properties['페르소나']?.rich_text?.[0]?.plain_text || '',
    isDefault: page.properties['기본전략']?.checkbox || false,
  }));
}

export async function getStrategy(id: string): Promise<Strategy | null> {
  const page: any = await notion.pages.retrieve({ page_id: id });

  return {
    id: page.id,
    name: page.properties['전략명']?.title?.[0]?.plain_text || '',
    icon: page.properties['아이콘']?.rich_text?.[0]?.plain_text || '🎯',
    description: page.properties['설명']?.rich_text?.[0]?.plain_text || '',
    systemPrompt: page.properties['시스템프롬프트']?.rich_text?.[0]?.plain_text || '',
    emotionGoal: page.properties['감정목표']?.rich_text?.[0]?.plain_text || '',
    persona: page.properties['페르소나']?.rich_text?.[0]?.plain_text || '',
    isDefault: page.properties['기본전략']?.checkbox || false,
  };
}

export async function createStrategy(data: Omit<Strategy, 'id'>): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: STRATEGY_DB_ID },
    properties: {
      '전략명': { title: [{ text: { content: data.name } }] },
      '아이콘': { rich_text: [{ text: { content: data.icon || '🎯' } }] },
      '설명': { rich_text: [{ text: { content: data.description || '' } }] },
      '시스템프롬프트': { rich_text: [{ text: { content: data.systemPrompt || '' } }] },
      '감정목표': { rich_text: [{ text: { content: data.emotionGoal || '' } }] },
      '페르소나': { rich_text: [{ text: { content: data.persona || '' } }] },
      '기본전략': { checkbox: data.isDefault ?? false },
    },
  });
  return response.id;
}

export async function updateStrategy(id: string, data: Partial<Strategy>): Promise<void> {
  const properties: Record<string, any> = {};

  if (data.name) properties['전략명'] = { title: [{ text: { content: data.name } }] };
  if (data.icon !== undefined) properties['아이콘'] = { rich_text: [{ text: { content: data.icon } }] };
  if (data.description !== undefined) properties['설명'] = { rich_text: [{ text: { content: data.description } }] };
  if (data.systemPrompt !== undefined) properties['시스템프롬프트'] = { rich_text: [{ text: { content: data.systemPrompt } }] };
  if (data.emotionGoal !== undefined) properties['감정목표'] = { rich_text: [{ text: { content: data.emotionGoal } }] };
  if (data.persona !== undefined) properties['페르소나'] = { rich_text: [{ text: { content: data.persona } }] };
  if (data.isDefault !== undefined) properties['기본전략'] = { checkbox: data.isDefault };

  await notion.pages.update({ page_id: id, properties });
}

export async function deleteStrategy(id: string): Promise<void> {
  await notion.pages.update({
    page_id: id,
    archived: true,
  });
}

// ============ 상품/서비스 관련 함수 ============
export async function getProducts(): Promise<Product[]> {
  const response = await notion.databases.query({
    database_id: PRODUCT_DB_ID,
    filter: { property: '활성화', checkbox: { equals: true } },
    sorts: [{ property: '상품명', direction: 'ascending' }],
  });

  return response.results.map((page: any) => ({
    id: page.id,
    name: page.properties['상품명']?.title?.[0]?.plain_text || '',
    shortDescription: page.properties['한줄설명']?.rich_text?.[0]?.plain_text || '',
    fullDescription: page.properties['상세설명']?.rich_text?.[0]?.plain_text || '',
    benefits: page.properties['핵심혜택']?.multi_select?.map((b: any) => b.name) || [],
    priceRange: page.properties['가격대']?.rich_text?.[0]?.plain_text || '',
    targetCustomer: page.properties['타겟고객']?.rich_text?.[0]?.plain_text || '',
    isActive: page.properties['활성화']?.checkbox || false,
  }));
}

export async function getProduct(id: string): Promise<Product | null> {
  const page: any = await notion.pages.retrieve({ page_id: id });

  return {
    id: page.id,
    name: page.properties['상품명']?.title?.[0]?.plain_text || '',
    shortDescription: page.properties['한줄설명']?.rich_text?.[0]?.plain_text || '',
    fullDescription: page.properties['상세설명']?.rich_text?.[0]?.plain_text || '',
    benefits: page.properties['핵심혜택']?.multi_select?.map((b: any) => b.name) || [],
    priceRange: page.properties['가격대']?.rich_text?.[0]?.plain_text || '',
    targetCustomer: page.properties['타겟고객']?.rich_text?.[0]?.plain_text || '',
    isActive: page.properties['활성화']?.checkbox || false,
  };
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<string> {
  const response = await notion.pages.create({
    parent: { database_id: PRODUCT_DB_ID },
    properties: {
      '상품명': { title: [{ text: { content: data.name } }] },
      '한줄설명': { rich_text: [{ text: { content: data.shortDescription || '' } }] },
      '상세설명': { rich_text: [{ text: { content: data.fullDescription || '' } }] },
      '핵심혜택': { multi_select: data.benefits.map(b => ({ name: b })) },
      '가격대': { rich_text: [{ text: { content: data.priceRange || '' } }] },
      '타겟고객': { rich_text: [{ text: { content: data.targetCustomer || '' } }] },
      '활성화': { checkbox: data.isActive ?? true },
    },
  });
  return response.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const properties: Record<string, any> = {};

  if (data.name) properties['상품명'] = { title: [{ text: { content: data.name } }] };
  if (data.shortDescription !== undefined) properties['한줄설명'] = { rich_text: [{ text: { content: data.shortDescription } }] };
  if (data.fullDescription !== undefined) properties['상세설명'] = { rich_text: [{ text: { content: data.fullDescription } }] };
  if (data.benefits) properties['핵심혜택'] = { multi_select: data.benefits.map(b => ({ name: b })) };
  if (data.priceRange !== undefined) properties['가격대'] = { rich_text: [{ text: { content: data.priceRange } }] };
  if (data.targetCustomer !== undefined) properties['타겟고객'] = { rich_text: [{ text: { content: data.targetCustomer } }] };
  if (data.isActive !== undefined) properties['활성화'] = { checkbox: data.isActive };

  await notion.pages.update({ page_id: id, properties });
}

export async function deleteProduct(id: string): Promise<void> {
  await notion.pages.update({
    page_id: id,
    archived: true,
  });
}
