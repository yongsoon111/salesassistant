'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { CustomerSelect } from '@/components/customer/customer-select';
import { ConversationInput } from '@/components/analysis/conversation-input';
import { AnalysisPanel } from '@/components/analysis/analysis-panel';
import { SituationInput } from '@/components/situation/situation-input';
import { GeneratedMessagePanel } from '@/components/situation/generated-message-panel';
import { ProductAddModal } from '@/components/product/product-add-modal';
import { useAnalysis } from '@/hooks';
import { useSituationMessage } from '@/hooks/useSituationMessage';
import { useProducts } from '@/hooks/useProducts';
import type { Customer } from '@/types';

type TabType = 'situation' | 'conversation';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('situation');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | undefined>();
  const [showProductModal, setShowProductModal] = useState(false);
  const { products, refetch: refetchProducts } = useProducts();
  const { analysis, isAnalyzing, analyzeConversation } = useAnalysis();
  const {
    situation,
    setSituation,
    generatedMessage,
    isGenerating,
    error: situationError,
    generateMessage,
  } = useSituationMessage();

  const handleAnalyze = (conversation: string) => {
    analyzeConversation(conversation, selectedCustomer?.id);
  };

  const handleGenerateMessage = () => {
    generateMessage(situation, undefined, selectedCustomer?.id, selectedProductId);
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-auto">
      <Header
        title="세일즈 어시스턴트"
        description="대화를 분석하고 최적의 응대 전략을 제안받으세요"
      />

      <div className="mt-6">
        <div className="max-w-7xl mx-auto">
          {/* 탭 선택 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('situation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'situation'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              ⚡ 상황 → 메시지 생성
            </button>
            <button
              onClick={() => setActiveTab('conversation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'conversation'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              💬 대화 분석
            </button>
          </div>

          {/* 공통: 고객/상품 선택 (컴팩트) */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">고객:</span>
              <CustomerSelect
                selectedId={selectedCustomer?.id || null}
                onSelect={setSelectedCustomer}
                compact
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">상품:</span>
              <select
                className="h-8 px-2 rounded-md border border-input bg-background text-sm"
                value={selectedProductId || ''}
                onChange={(e) => setSelectedProductId(e.target.value || undefined)}
              >
                <option value="">선택 안함</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowProductModal(true)}
                className="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent"
                title="새 상품 추가"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {activeTab === 'situation' ? (
              <>
                <SituationInput
                  value={situation}
                  onChange={setSituation}
                  onGenerate={handleGenerateMessage}
                  isGenerating={isGenerating}
                  error={situationError}
                />
                <GeneratedMessagePanel result={generatedMessage} isLoading={isGenerating} />
              </>
            ) : (
              <>
                {/* 대화 분석 */}
                <ConversationInput
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">분석 결과</h3>
                  <AnalysisPanel analysis={analysis} isLoading={isAnalyzing} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 상품 추가 모달 */}
      <ProductAddModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSuccess={(productId) => {
          setSelectedProductId(productId);
          refetchProducts();
          setShowProductModal(false);
        }}
      />
    </div>
  );
}
