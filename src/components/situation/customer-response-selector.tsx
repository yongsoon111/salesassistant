'use client';

import { useState } from 'react';
import { CUSTOMER_RESPONSES, CustomerResponse, Technique } from '@/data/sales-situations';
import { Card } from '@/components/ui/card';

interface CustomerResponseSelectorProps {
  onSelectTechnique: (technique: Technique, response: CustomerResponse) => void;
  selectedTechniqueId?: string;
}

export function CustomerResponseSelector({
  onSelectTechnique,
  selectedTechniqueId,
}: CustomerResponseSelectorProps) {
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);
  const [expandedTechniqueId, setExpandedTechniqueId] = useState<string | null>(null);

  const selectedResponse = CUSTOMER_RESPONSES.find((r) => r.id === selectedResponseId);

  const handleTechniqueClick = (technique: Technique, response: CustomerResponse) => {
    if (expandedTechniqueId === technique.id) {
      onSelectTechnique(technique, response);
    } else {
      setExpandedTechniqueId(technique.id);
    }
  };

  const handleExampleClick = (example: string, technique: Technique, response: CustomerResponse) => {
    onSelectTechnique(
      {
        ...technique,
        description: `${technique.description}\n\n선택한 예시: "${example}"`,
      },
      response
    );
  };

  return (
    <div className="space-y-4">
      {/* 질문 헤더 */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          지금 고객이 뭐라고 해?
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          고객의 반응을 선택하면 추천 기법을 보여드려요
        </p>
      </div>

      {/* 고객 반응 버튼들 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {CUSTOMER_RESPONSES.map((response) => {
          const isSelected = selectedResponseId === response.id;

          return (
            <button
              key={response.id}
              onClick={() => {
                setSelectedResponseId(response.id);
                setExpandedTechniqueId(null);
              }}
              className={`
                p-3 rounded-lg text-sm font-medium transition-all text-left
                ${isSelected
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              <div className="font-semibold">{response.label}</div>
              <div className={`text-xs mt-1 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {response.situation}
              </div>
            </button>
          );
        })}
      </div>

      {/* 선택된 반응의 추천 기법들 */}
      {selectedResponse && (
        <Card className="p-4 mt-4">
          <div className="space-y-4">
            {/* 헤더 */}
            <div className="pb-3 border-b border-border">
              <h4 className="font-semibold text-primary">{selectedResponse.label}</h4>
              <p className="text-sm text-muted-foreground">{selectedResponse.situation}일 때 추천 기법</p>
            </div>

            {/* 기법 목록 */}
            <div className="space-y-3">
              {selectedResponse.techniques.map((technique) => {
                const isExpanded = expandedTechniqueId === technique.id;
                const isSelected = selectedTechniqueId === technique.id;

                return (
                  <div
                    key={technique.id}
                    className={`
                      rounded-lg border-2 transition-all overflow-hidden
                      ${isSelected
                        ? 'border-primary bg-primary/5'
                        : isExpanded
                        ? 'border-primary/50 bg-accent/50'
                        : 'border-border hover:border-primary/30'
                      }
                    `}
                  >
                    {/* 기법 헤더 */}
                    <button
                      onClick={() => handleTechniqueClick(technique, selectedResponse)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h5 className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                            {technique.name}
                          </h5>
                          <p className="text-sm text-muted-foreground">{technique.description}</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* 예시 화법 */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">💬 예시 화법 (클릭해서 선택)</p>
                        <div className="space-y-2">
                          {technique.examples.map((example, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleExampleClick(example, technique, selectedResponse)}
                              className="w-full text-left p-3 rounded-md bg-background border border-border hover:border-primary hover:bg-primary/5 transition-all text-sm"
                            >
                              "{example}"
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => onSelectTechnique(technique, selectedResponse)}
                          className="w-full mt-2 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                        >
                          이 기법으로 메시지 생성
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* 미선택 시 안내 */}
      {!selectedResponse && (
        <div className="text-center py-6 text-muted-foreground">
          <p className="text-sm">고객 반응을 선택해주세요</p>
        </div>
      )}
    </div>
  );
}
