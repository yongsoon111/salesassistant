'use client';

import { Header } from '@/components/layout/header';
import { ConversationInput } from '@/components/analysis/conversation-input';
import { AnalysisPanel } from '@/components/analysis/analysis-panel';
import { useAnalysis } from '@/hooks';

export default function HomePage() {
  const { analysis, isAnalyzing, analyzeConversation } = useAnalysis();

  const handleAnalyze = (conversation: string) => {
    analyzeConversation(conversation);
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-auto">
      <Header
        title="고객이 뭐라고 해?"
        description="고객 대화를 붙여넣고 분석해보세요"
      />

      <div className="mt-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <ConversationInput
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">분석 결과</h3>
              <AnalysisPanel analysis={analysis} isLoading={isAnalyzing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
