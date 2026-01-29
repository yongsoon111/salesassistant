import { Client } from '@notionhq/client';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n🎯 세일즈 어시스턴트 - Notion 자동 설정\n');
  console.log('이 스크립트는 필요한 모든 Notion 데이터베이스를 자동으로 생성합니다.\n');

  // 1. API 키 입력받기
  const notionApiKey = await question('Notion API 키를 입력하세요: ');
  if (!notionApiKey.trim()) {
    console.error('❌ API 키가 필요합니다.');
    process.exit(1);
  }

  // 2. Gemini API 키 입력받기
  const geminiApiKey = await question('Gemini API 키를 입력하세요: ');
  if (!geminiApiKey.trim()) {
    console.error('❌ Gemini API 키가 필요합니다.');
    process.exit(1);
  }

  // 3. 부모 페이지 ID 입력받기
  console.log('\n📝 데이터베이스를 생성할 Notion 페이지가 필요합니다.');
  console.log('   빈 페이지를 하나 만들고, 그 페이지의 URL에서 ID를 복사하세요.');
  console.log('   예: https://notion.so/My-Page-abc123def456 → abc123def456\n');
  const parentPageId = await question('부모 페이지 ID를 입력하세요: ');
  if (!parentPageId.trim()) {
    console.error('❌ 부모 페이지 ID가 필요합니다.');
    process.exit(1);
  }

  const notion = new Client({ auth: notionApiKey.trim() });

  console.log('\n⏳ 데이터베이스 생성 중...\n');

  try {
    // 4. 고객 DB 생성
    console.log('📊 고객 DB 생성 중...');
    const customerDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentPageId.trim() },
      title: [{ type: 'text', text: { content: '고객 관리' } }],
      properties: {
        '고객명': { title: {} },
        '회사명': { rich_text: {} },
        '상태': {
          select: {
            options: [
              { name: '리드', color: 'blue' },
              { name: '상담중', color: 'yellow' },
              { name: '제안', color: 'purple' },
              { name: '계약', color: 'green' },
              { name: '해지', color: 'red' },
            ],
          },
        },
        '메모': { rich_text: {} },
        '등록일': { date: {} },
        '최종연락일': { date: {} },
      },
    });
    console.log('✅ 고객 DB 생성 완료');

    // 5. 스크립트 DB 생성
    console.log('📊 스크립트 DB 생성 중...');
    const scriptDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentPageId.trim() },
      title: [{ type: 'text', text: { content: '스크립트 라이브러리' } }],
      properties: {
        '제목': { title: {} },
        '카테고리': {
          select: {
            options: [
              { name: '인사', color: 'blue' },
              { name: '라포', color: 'green' },
              { name: '가치제안', color: 'purple' },
              { name: '반론처리', color: 'orange' },
              { name: '클로징', color: 'red' },
              { name: '기타', color: 'gray' },
            ],
          },
        },
        '내용': { rich_text: {} },
        '키워드': { multi_select: { options: [] } },
        '사용횟수': { number: {} },
        '활성화': { checkbox: {} },
      },
    });
    console.log('✅ 스크립트 DB 생성 완료');

    // 6. 자료 DB 생성
    console.log('📊 자료 DB 생성 중...');
    const materialDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentPageId.trim() },
      title: [{ type: 'text', text: { content: '자료실' } }],
      properties: {
        '자료명': { title: {} },
        '유형': {
          select: {
            options: [
              { name: '포트폴리오', color: 'blue' },
              { name: '가격표', color: 'green' },
              { name: '사례', color: 'purple' },
              { name: '계약서', color: 'orange' },
              { name: '기타', color: 'gray' },
            ],
          },
        },
        'URL': { url: {} },
        '설명': { rich_text: {} },
        '키워드': { multi_select: { options: [] } },
        '사용횟수': { number: {} },
      },
    });
    console.log('✅ 자료 DB 생성 완료');

    // 7. 세일즈 단계 DB 생성
    console.log('📊 세일즈 단계 DB 생성 중...');
    const stageDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentPageId.trim() },
      title: [{ type: 'text', text: { content: '세일즈 단계' } }],
      properties: {
        '단계명': { title: {} },
        '순서': { number: {} },
        '목표인식': { rich_text: {} },
        'AI지시': { rich_text: {} },
        '핵심질문': { rich_text: {} },
        '전환신호': { rich_text: {} },
        '주의사항': { rich_text: {} },
        '활성화': { checkbox: {} },
      },
    });
    console.log('✅ 세일즈 단계 DB 생성 완료');

    // 8. 전략 DB 생성
    console.log('📊 전략 DB 생성 중...');
    const strategyDb = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentPageId.trim() },
      title: [{ type: 'text', text: { content: '전략' } }],
      properties: {
        '전략명': { title: {} },
        '아이콘': { rich_text: {} },
        '설명': { rich_text: {} },
        '시스템프롬프트': { rich_text: {} },
        '감정목표': { rich_text: {} },
        '페르소나': { rich_text: {} },
        '기본전략': { checkbox: {} },
      },
    });
    console.log('✅ 전략 DB 생성 완료');

    // 9. 초기 데이터 삽입 - 세일즈 단계
    console.log('\n⏳ 초기 데이터 삽입 중...\n');
    console.log('📝 기본 세일즈 단계 생성 중...');

    const defaultStages = [
      {
        name: '첫 대화',
        order: 1,
        targetPerception: '이 사람은 전문가 같다. 한번 들어볼만 하다.',
        aiInstruction: '친근하면서도 전문적인 첫인상을 주세요. 고객의 현재 상황을 파악하는 질문을 하세요.',
        keyQuestions: '현재 어떤 방식으로 마케팅을 하고 계신가요?',
        transitionSignals: '고객이 현재 상황에 대해 이야기하기 시작함',
        warnings: '너무 빨리 상품 소개로 넘어가지 마세요',
      },
      {
        name: '라포 형성',
        order: 2,
        targetPerception: '이 사람은 내 상황을 이해하고 있다.',
        aiInstruction: '고객의 말에 공감하고, 비슷한 사례나 경험을 공유하세요.',
        keyQuestions: '그 부분이 특히 고민이시겠네요. 혹시 이전에 시도해보신 방법이 있으신가요?',
        transitionSignals: '고객이 고민이나 어려움을 솔직하게 이야기함',
        warnings: '공감 없이 바로 해결책을 제시하지 마세요',
      },
      {
        name: '가치 소개',
        order: 3,
        targetPerception: '이 서비스가 내 문제를 해결해줄 수 있겠다.',
        aiInstruction: '고객의 니즈와 연결해서 서비스의 가치를 설명하세요. 구체적인 사례를 활용하세요.',
        keyQuestions: '비슷한 상황의 업체가 이 방법으로 외국인 고객이 30% 늘었어요.',
        transitionSignals: '고객이 서비스에 관심을 보이며 질문함',
        warnings: '기능 나열보다 고객 관점의 혜택을 강조하세요',
      },
      {
        name: '니즈 파악 (5 Whys)',
        order: 4,
        targetPerception: '내가 진짜 원하는 게 뭔지 알게 됐다.',
        aiInstruction: '왜?를 반복해서 고객의 진짜 니즈를 파악하세요. 표면적 니즈 뒤의 근본 욕구를 찾으세요.',
        keyQuestions: '외국인 고객을 늘리고 싶으신 이유가 뭔가요? → 그게 왜 중요하신가요?',
        transitionSignals: '고객이 깊은 고민이나 진짜 목표를 이야기함',
        warnings: '심문하는 느낌이 들지 않게 자연스럽게 물어보세요',
      },
      {
        name: '핵심 문제 짚기',
        order: 5,
        targetPerception: '맞아, 이게 내 핵심 문제야. 이걸 해결해야 해.',
        aiInstruction: '파악한 니즈를 정리해서 핵심 문제를 명확히 짚어주세요.',
        keyQuestions: '정리하면, 외국인 고객 확보가 안 되는 핵심 원인은 구글맵 노출 부족인 거죠?',
        transitionSignals: '고객이 "맞아요", "그렇죠"라며 동의함',
        warnings: '고객의 문제를 과장하거나 공포 마케팅하지 마세요',
      },
      {
        name: '클로징',
        order: 6,
        targetPerception: '지금 시작하는 게 좋겠다.',
        aiInstruction: '구체적인 다음 단계를 제안하세요. 시작하기 쉬운 작은 행동부터 제안하세요.',
        keyQuestions: '우선 무료로 현재 구글맵 상태를 진단해드릴까요?',
        transitionSignals: '고객이 가격, 일정, 진행 방법을 물어봄',
        warnings: '너무 밀어붙이지 마세요. 거절해도 관계는 유지하세요.',
      },
    ];

    for (const stage of defaultStages) {
      await notion.pages.create({
        parent: { database_id: stageDb.id },
        properties: {
          '단계명': { title: [{ text: { content: stage.name } }] },
          '순서': { number: stage.order },
          '목표인식': { rich_text: [{ text: { content: stage.targetPerception } }] },
          'AI지시': { rich_text: [{ text: { content: stage.aiInstruction } }] },
          '핵심질문': { rich_text: [{ text: { content: stage.keyQuestions } }] },
          '전환신호': { rich_text: [{ text: { content: stage.transitionSignals } }] },
          '주의사항': { rich_text: [{ text: { content: stage.warnings } }] },
          '활성화': { checkbox: true },
        },
      });
    }
    console.log('✅ 6개 기본 세일즈 단계 생성 완료');

    // 10. 초기 데이터 삽입 - 기본 전략
    console.log('📝 기본 전략 생성 중...');
    await notion.pages.create({
      parent: { database_id: strategyDb.id },
      properties: {
        '전략명': { title: [{ text: { content: '신뢰 구축형' } }] },
        '아이콘': { rich_text: [{ text: { content: '🤝' } }] },
        '설명': { rich_text: [{ text: { content: '신뢰와 전문성을 강조하는 기본 전략' } }] },
        '시스템프롬프트': { rich_text: [{ text: { content: '전문적이면서도 따뜻한 톤으로 대화하세요.' } }] },
        '감정목표': { rich_text: [{ text: { content: '안심, 신뢰' } }] },
        '페르소나': { rich_text: [{ text: { content: '경험 많은 마케팅 전문가' } }] },
        '기본전략': { checkbox: true },
      },
    });
    console.log('✅ 기본 전략 생성 완료');

    // 11. 초기 데이터 삽입 - 샘플 스크립트
    console.log('📝 샘플 스크립트 생성 중...');
    const sampleScripts = [
      {
        title: '첫 인사 - 문의 감사',
        category: '인사',
        content: '안녕하세요! 문의 주셔서 감사합니다. 구글맵 상위노출 서비스에 관심을 가져주셨군요. 현재 어떤 업종을 운영하고 계신가요?',
      },
      {
        title: '공감 - 외국인 고객 고민',
        category: '라포',
        content: '외국인 고객 유치가 쉽지 않으시죠. 특히 명동 같은 상권은 경쟁이 치열해서 온라인에서 먼저 눈에 띄는 게 정말 중요하더라고요.',
      },
      {
        title: '가치 제안 - 3개 언어 혜택',
        category: '가치제안',
        content: '저희 서비스는 한국어, 영어, 일본어 3개 국어로 구글맵 프로필을 최적화해드려요. 실제로 이 방법으로 외국인 고객이 평균 40% 증가한 사례가 많습니다.',
      },
      {
        title: '반론 처리 - 가격 고민',
        category: '반론처리',
        content: '가격이 부담되시는 마음 이해합니다. 다만 월 120만원으로 매달 외국인 고객 10명만 더 오셔도 충분히 투자 대비 효과가 있으실 거예요.',
      },
      {
        title: '클로징 - 무료 진단 제안',
        category: '클로징',
        content: '우선 부담 없이 현재 구글맵 상태를 무료로 진단해드릴까요? 10분 정도면 현재 상황과 개선 포인트를 알려드릴 수 있어요.',
      },
    ];

    for (const script of sampleScripts) {
      await notion.pages.create({
        parent: { database_id: scriptDb.id },
        properties: {
          '제목': { title: [{ text: { content: script.title } }] },
          '카테고리': { select: { name: script.category } },
          '내용': { rich_text: [{ text: { content: script.content } }] },
          '사용횟수': { number: 0 },
          '활성화': { checkbox: true },
        },
      });
    }
    console.log('✅ 5개 샘플 스크립트 생성 완료');

    // 12. .env.local 파일 생성
    console.log('\n📝 .env.local 파일 생성 중...');
    const envContent = `# ===========================================
# 세일즈 어시스턴트 환경 변수
# ===========================================
# 자동 생성됨: ${new Date().toLocaleString('ko-KR')}

# -------------------------------------------
# Notion API 설정
# -------------------------------------------
NOTION_API_KEY=${notionApiKey.trim()}

# 자동 생성된 DB IDs
NOTION_CUSTOMER_DB_ID=${customerDb.id}
NOTION_SCRIPT_DB_ID=${scriptDb.id}
NOTION_MATERIAL_DB_ID=${materialDb.id}
NOTION_STAGE_DB_ID=${stageDb.id}
NOTION_STRATEGY_DB_ID=${strategyDb.id}

# -------------------------------------------
# Gemini API 설정
# -------------------------------------------
GEMINI_API_KEY=${geminiApiKey.trim()}
`;

    const envPath = path.join(process.cwd(), '.env.local');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local 파일 생성 완료');

    // 완료 메시지
    console.log('\n' + '='.repeat(50));
    console.log('🎉 설정 완료!');
    console.log('='.repeat(50));
    console.log('\n다음 명령어로 앱을 실행하세요:\n');
    console.log('  npm run dev\n');
    console.log('그리고 브라우저에서 http://localhost:3000 을 열어주세요.\n');

  } catch (error: any) {
    console.error('\n❌ 오류 발생:', error.message);
    if (error.code === 'unauthorized') {
      console.error('   → Notion API 키가 올바르지 않습니다.');
    } else if (error.code === 'object_not_found') {
      console.error('   → 부모 페이지 ID가 올바르지 않거나 Integration에 접근 권한이 없습니다.');
      console.error('   → 페이지에서 ... → Connections → 해당 Integration을 추가했는지 확인하세요.');
    }
    process.exit(1);
  }

  rl.close();
}

main();
