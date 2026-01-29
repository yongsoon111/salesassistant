'use client';

import { useState, useRef, useEffect } from 'react';
import { SALES_STAGES, SalesSituation, SalesStage } from '@/data/sales-situations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface StepSituationSelectorProps {
  onSelectSituation: (situation: SalesSituation, stage: SalesStage) => void;
  selectedSituationId?: string;
}

export function StepSituationSelector({
  onSelectSituation,
  selectedSituationId
}: StepSituationSelectorProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>(SALES_STAGES[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedStage = SALES_STAGES.find(stage => stage.id === selectedStageId) || SALES_STAGES[0];

  // 스테이지 선택 시 해당 스테이지로 스크롤
  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.querySelector(`[data-stage-id="${selectedStageId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedStageId]);

  const handleStageClick = (stageId: string) => {
    setSelectedStageId(stageId);
  };

  const handleSituationClick = (situation: SalesSituation) => {
    onSelectSituation(situation, selectedStage);
  };

  return (
    <div className="space-y-6">
      {/* 스텝 진행바 */}
      <div className="relative">
        {/* 연결선 배경 */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-border hidden md:block" />

        {/* 스크롤 가능한 스테이지 컨테이너 */}
        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto pb-2 hide-scrollbar"
        >
          <div className="flex items-start gap-2 md:gap-0 min-w-max md:min-w-0">
            {SALES_STAGES.map((stage, index) => {
              const isSelected = stage.id === selectedStageId;
              const isCompleted = stage.order < selectedStage.order;

              return (
                <div
                  key={stage.id}
                  data-stage-id={stage.id}
                  className="flex items-center flex-shrink-0"
                  style={{ width: index < SALES_STAGES.length - 1 ? 'calc(100% / 8)' : 'auto' }}
                >
                  {/* 스테이지 버튼 */}
                  <button
                    onClick={() => handleStageClick(stage.id)}
                    className={`
                      group relative flex flex-col items-center gap-2 px-3 py-2 rounded-lg transition-all
                      hover:bg-accent/50
                      ${isSelected ? 'scale-105' : ''}
                    `}
                  >
                    {/* 아이콘 원형 배경 */}
                    <div
                      className={`
                        relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-2xl
                        transition-all duration-300
                        ${isSelected
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-lg shadow-primary/50'
                          : isCompleted
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                        }
                      `}
                    >
                      {stage.icon}
                    </div>

                    {/* 스테이지 이름 */}
                    <div className="flex flex-col items-center gap-1 min-w-[80px]">
                      <span
                        className={`
                          text-xs font-medium transition-colors whitespace-nowrap
                          ${isSelected
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground'
                          }
                        `}
                      >
                        {stage.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {stage.order}/8
                      </span>
                    </div>
                  </button>

                  {/* 연결 화살표 (마지막 제외) */}
                  {index < SALES_STAGES.length - 1 && (
                    <div className="hidden md:flex items-center flex-1 px-1">
                      <svg
                        className={`
                          w-full h-2 transition-colors
                          ${isCompleted ? 'text-primary' : 'text-border'}
                        `}
                        viewBox="0 0 100 10"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0 5 L95 5 L90 2 M95 5 L90 8"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 선택된 스테이지의 상황들 */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <span className="text-3xl">{selectedStage.icon}</span>
            <div>
              <h3 className="text-lg font-semibold">{selectedStage.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedStage.situations.length}개의 상황
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedStage.situations.map((situation) => {
              const isSelected = situation.id === selectedSituationId;

              return (
                <button
                  key={situation.id}
                  onClick={() => handleSituationClick(situation)}
                  className={`
                    group relative p-4 rounded-lg border-2 transition-all text-left
                    hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5
                    ${isSelected
                      ? 'border-primary bg-primary/5 shadow-md shadow-primary/20'
                      : 'border-border bg-card hover:border-primary/50'
                    }
                  `}
                >
                  {/* 선택 표시 */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pr-6">
                    <h4
                      className={`
                        font-medium transition-colors
                        ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}
                      `}
                    >
                      {situation.label}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {situation.description}
                    </p>
                  </div>

                  {/* 호버 효과 */}
                  <div
                    className={`
                      absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
                      ${isSelected ? 'opacity-100' : ''}
                    `}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </Card>

    </div>
  );
}
