'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CustomerResponseSelector } from './customer-response-selector';
import { CustomerResponse, Technique } from '@/data/sales-situations';

interface SituationInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error?: string | null;
}

export function SituationInput({
  value,
  onChange,
  onGenerate,
  isGenerating,
  error,
}: SituationInputProps) {
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<string | undefined>();

  const handleTechniqueSelect = (technique: Technique, response: CustomerResponse) => {
    setSelectedTechniqueId(technique.id);
    const situationText = `고객 반응: ${response.label}
상황: ${response.situation}

추천 기법: ${technique.name}
${technique.description}

예시 화법:
${technique.examples.map((ex) => `• "${ex}"`).join('\n')}`;
    onChange(situationText);
  };

  return (
    <div className="space-y-4">
      {/* 고객 반응 기반 기법 선택기 */}
      <Card>
        <CardContent className="pt-4">
          <CustomerResponseSelector
            onSelectTechnique={handleTechniqueSelect}
            selectedTechniqueId={selectedTechniqueId}
          />
        </CardContent>
      </Card>

      {/* 상황 입력 및 생성 */}
      <Card>
        <CardContent className="pt-4 space-y-3">
          <Textarea
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (e.target.value !== value) {
                setSelectedTechniqueId(undefined);
              }
            }}
            placeholder="상황을 선택하거나 직접 입력하세요..."
            className="min-h-[100px] resize-none"
            disabled={isGenerating}
          />
          {error && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
          <Button
            onClick={onGenerate}
            disabled={isGenerating || !value.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                생성 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                메시지 생성
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
