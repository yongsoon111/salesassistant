'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { SituationInput } from '@/components/situation/situation-input';
import { GeneratedMessagePanel } from '@/components/situation/generated-message-panel';
import { useSituationMessage } from '@/hooks/useSituationMessage';

export default function HomePage() {
  const {
    situation,
    setSituation,
    generatedMessage,
    isGenerating,
    error: situationError,
    generateMessage,
  } = useSituationMessage();

  const handleGenerateMessage = () => {
    generateMessage(situation);
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-auto">
      <Header
        title="고객이 뭐라고 해?"
        description="고객 반응에 맞는 세일즈 전략을 확인하세요"
      />

      <div className="mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <SituationInput
              value={situation}
              onChange={setSituation}
              onGenerate={handleGenerateMessage}
              isGenerating={isGenerating}
              error={situationError}
            />
            <GeneratedMessagePanel result={generatedMessage} isLoading={isGenerating} />
          </div>
        </div>
      </div>
    </div>
  );
}
