import useSWR from 'swr';
import type { SalesStage, ApiResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStages() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<SalesStage[]>>(
    '/api/stages',
    fetcher
  );

  const createStage = async (stage: Omit<SalesStage, 'id'>) => {
    const res = await fetch('/api/stages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stage),
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const updateStage = async (id: string, updates: Partial<SalesStage>) => {
    const res = await fetch(`/api/stages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  return {
    stages: data?.data || [],
    isLoading,
    error,
    createStage,
    updateStage,
    refresh: mutate,
  };
}
