'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { useStrategies } from '@/hooks';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { StrategyFormModal } from '@/components/strategy/strategy-form-modal';
import type { Strategy } from '@/types';

export default function StrategyPage() {
  const { strategies, isLoading, createStrategy, updateStrategy, deleteStrategy } = useStrategies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | undefined>();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedStrategy(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (strategy: Strategy) => {
    setModalMode('edit');
    setSelectedStrategy(strategy);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStrategy(undefined);
  };

  const handleSubmit = async (data: Omit<Strategy, 'id'>) => {
    if (modalMode === 'create') {
      await createStrategy(data);
    } else if (selectedStrategy) {
      await updateStrategy(selectedStrategy.id, data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 이 전략을 삭제하시겠습니까?')) {
      await deleteStrategy(id);
    }
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-auto">
      <Header
        title="전략 관리"
        description="상황별 세일즈 전략과 페르소나를 관리하세요"
      />

      <div className="mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-end">
            <Button onClick={handleOpenCreateModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              전략 추가
            </Button>
          </div>
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">전략 로딩 중...</div>
          ) : strategies.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              등록된 전략이 없습니다.
            </div>
          ) : (
            <div className="grid gap-4">
              {strategies.map((strategy) => (
                <Card
                  key={strategy.id}
                  className="hover:bg-accent/30 transition-colors relative group"
                  onMouseEnter={() => setHoveredId(strategy.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl">{strategy.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{strategy.name}</h3>
                          {strategy.isDefault && (
                            <Badge variant="default">기본 전략</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">{strategy.description}</p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium mb-1">
                              🎯 감정 목표
                            </p>
                            <p className="text-sm">{strategy.emotionGoal}</p>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium mb-1">
                              👤 페르소나
                            </p>
                            <p className="text-sm">{strategy.persona}</p>
                          </div>
                        </div>

                        {strategy.systemPrompt && (
                          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                            <p className="text-xs text-primary font-medium mb-1">
                              💬 시스템 프롬프트
                            </p>
                            <p className="text-sm line-clamp-2">{strategy.systemPrompt}</p>
                          </div>
                        )}
                      </div>

                      {hoveredId === strategy.id && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEditModal(strategy)}
                            className="h-8 px-3"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            <span className="ml-1">수정</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(strategy.id)}
                            className="h-8 px-3"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span className="ml-1">삭제</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <StrategyFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mode={modalMode}
        initialData={selectedStrategy}
      />
    </div>
  );
}
