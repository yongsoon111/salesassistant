
import { Script, Resource, Scenario, Category, StrategicGoal } from './types';

export const INITIAL_SCRIPTS: Script[] = [
  {
    id: '1',
    title: '환영 인사말',
    content: '안녕하세요! 문의주셔서 감사합니다. 저는 귀하의 성공을 돕는 파트너입니다. 무엇을 도와드릴까요?',
    category: 'Greeting',
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: '가격 문의 대응',
    content: '저희 서비스의 가격 구성은 기본적으로 프로젝트의 범위에 따라 달라집니다. 자세한 견적을 위해 현재 고민 중이신 내용을 공유해주실 수 있을까요?',
    category: 'Sales',
    updatedAt: Date.now(),
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: '1',
    name: '2024 포트폴리오',
    type: 'Link',
    url: 'https://example.com/portfolio',
    description: '최신 작업물 모음집',
    updatedAt: Date.now(),
  }
];

export const SCENARIOS: Scenario[] = [
  { id: 'price', label: '가격 협상', description: '비용 저항감을 해소하고 가치를 입증해야 할 때', icon: '💰' },
  { id: 'complaint', label: '불만 대응', description: '부정적 감정을 신뢰로 전환해야 할 때', icon: '😠' },
  { id: 'feature', label: '가치 제안', description: '우리 서비스의 독보적 장점을 각인시킬 때', icon: '✨' },
  { id: 'closing', label: '최종 결정', description: '망설이는 고객의 등을 밀어줘야 할 때', icon: '🎯' }
];

export const DEFAULT_GOALS: StrategicGoal[] = [
  { id: 'Expertise', label: '전문성 강조', icon: '🛡️', description: '신뢰할 수 있는 전문가로 인식됨' },
  { id: 'Empathy', label: '공감적 유대', icon: '🤝', description: '내 마음을 잘 아는 파트너로 인식됨' },
  { id: 'Authority', label: '단호한 리더십', icon: '⚖️', description: '주도권 확보' },
  { id: 'Urgency', label: '기회 상실 자극', icon: '🔥', description: '위기감 조성' }
];

export const CATEGORIES: Category[] = ['General', 'Greeting', 'Sales', 'Inquiry', 'Conflict', 'Closing'];
