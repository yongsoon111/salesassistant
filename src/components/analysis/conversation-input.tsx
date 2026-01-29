'use client';

import { useState } from 'react';
import { Button, Textarea, Card, CardContent } from '@/components/ui';

interface ConversationInputProps {
  onAnalyze: (conversation: string) => void;
  isAnalyzing: boolean;
}

export function ConversationInput({ onAnalyze, isAnalyzing }: ConversationInputProps) {
  const [conversation, setConversation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conversation.trim()) {
      onAnalyze(conversation);
    }
  };

  const exampleConversation = `고객: 안녕하세요, 구글맵 상위노출 서비스 문의드립니다.

나: 안녕하세요! 문의 감사합니다. 어떤 업종이시고, 현재 구글맵에서 어느 정도 위치에 노출되고 계신가요?

고객: 명동에 있는 피부과인데요, 검색해보면 2페이지 정도에 나오더라고요. 외국인 환자도 많이 받고 싶은데...

나: 아, 명동 피부과시군요. 외국인 환자분들이 타겟이시면 구글맵 상위노출이 정말 효과적이에요. 현재 일본어나 영어로도 프로필이 설정되어 있으신가요?

고객: 아니요, 한국어만 되어있어요. 그게 중요한가요?`;

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              대화 내용 붙여넣기
            </label>
            <Textarea
              value={conversation}
              onChange={(e) => setConversation(e.target.value)}
              placeholder="고객과의 대화 내용을 붙여넣으세요..."
              className="min-h-[200px] font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConversation(exampleConversation)}
            >
              예시 대화 불러오기
            </Button>

            <Button type="submit" disabled={!conversation.trim() || isAnalyzing}>
              {isAnalyzing ? '분석 중...' : '🔍 분석하기'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
