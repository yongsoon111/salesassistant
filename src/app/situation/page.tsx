'use client';

import { SituationInput, GeneratedMessagePanel } from '@/components/situation';
import { useSituationMessage } from '@/hooks/useSituationMessage';

export default function SituationPage() {
  const {
    situation,
    setSituation,
    generatedMessage,
    isGenerating,
    error,
    generateMessage,
  } = useSituationMessage();

  const handleGenerate = () => {
    generateMessage(situation);
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-auto bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">상황 기반 메시지 생성</h1>
          <p className="text-muted-foreground">
            현재 고객과의 상황을 입력하면 AI가 최적의 응대 메시지를 생성해드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 상황 입력 */}
          <div>
            <SituationInput
              value={situation}
              onChange={setSituation}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              error={error}
            />
          </div>

          {/* 오른쪽: 생성된 메시지 */}
          <div>
            <GeneratedMessagePanel result={generatedMessage} isLoading={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
}
