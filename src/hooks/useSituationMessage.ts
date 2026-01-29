'use client';

import { useState } from 'react';

export interface GeneratedMessage {
  type: '공감' | '질문' | '가치제안' | '반론처리' | '클로징';
  text: string;
  explanation: string;
}

export interface SituationMessageResult {
  situation: string;
  analysis: string;
  approach: string;
  messages: GeneratedMessage[];
}

export function useSituationMessage() {
  const [situation, setSituation] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState<SituationMessageResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMessage = async (
    inputSituation: string,
    strategyId?: string,
    customerId?: string,
    productId?: string
  ) => {
    if (!inputSituation.trim()) {
      setError('상황을 입력해주세요');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          situation: inputSituation,
          strategyId,
          customerId,
          productId,
        }),
      });

      if (!response.ok) {
        throw new Error('메시지 생성에 실패했습니다');
      }

      const result = await response.json();

      if (result.success && result.data) {
        setGeneratedMessage(result.data);
        setSituation(inputSituation);
      } else {
        throw new Error(result.error || '메시지 생성에 실패했습니다');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다';
      setError(errorMessage);
      console.error('Failed to generate message:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setSituation('');
    setGeneratedMessage(null);
    setError(null);
  };

  return {
    situation,
    setSituation,
    generatedMessage,
    isGenerating,
    error,
    generateMessage,
    reset,
  };
}
