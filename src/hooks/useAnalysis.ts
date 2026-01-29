import { useState } from 'react';
import type { AnalysisResult, ApiResponse } from '@/types';

export function useAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeConversation = async (
    conversation: string,
    customerId?: string,
    strategyId?: string
  ) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation, customerId, strategyId }),
      });
      const result: ApiResponse<AnalysisResult> = await res.json();

      if (result.success && result.data) {
        setAnalysis(result.data);
        return result.data;
      } else {
        setError(result.error || 'Analysis failed');
        return null;
      }
    } catch (e) {
      setError('Failed to analyze conversation');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateQuickResponse = async (
    conversation: string,
    type: string,
    context?: string
  ): Promise<string | null> => {
    try {
      const res = await fetch('/api/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation,
          quickResponse: { type, context },
        }),
      });
      const result = await res.json();
      return result.success ? result.data.response : null;
    } catch {
      return null;
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setError(null);
  };

  return {
    analysis,
    isAnalyzing,
    error,
    analyzeConversation,
    generateQuickResponse,
    clearAnalysis,
  };
}
