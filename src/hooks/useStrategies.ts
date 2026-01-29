import useSWR from 'swr';
import type { Strategy, ApiResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useStrategies() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Strategy[]>>(
    '/api/strategy',
    fetcher
  );

  const createStrategy = async (strategy: Omit<Strategy, 'id'>) => {
    const res = await fetch('/api/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(strategy),
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const updateStrategy = async (id: string, updates: Partial<Strategy>) => {
    const res = await fetch(`/api/strategy/${id}`, {
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

  const deleteStrategy = async (id: string) => {
    const res = await fetch(`/api/strategy/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  return {
    strategies: data?.data || [],
    isLoading,
    error,
    createStrategy,
    updateStrategy,
    deleteStrategy,
    refresh: mutate,
  };
}
