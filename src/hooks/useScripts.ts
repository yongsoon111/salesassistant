import useSWR from 'swr';
import type { Script, ApiResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useScripts() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Script[]>>(
    '/api/scripts',
    fetcher
  );

  const createScript = async (script: Omit<Script, 'id'>) => {
    const res = await fetch('/api/scripts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(script),
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const updateScript = async (id: string, updates: Partial<Script>) => {
    const res = await fetch(`/api/scripts/${id}`, {
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

  const deleteScript = async (id: string) => {
    const res = await fetch(`/api/scripts/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const incrementUseCount = async (id: string) => {
    await fetch(`/api/scripts/${id}/use`, { method: 'POST' });
    mutate();
  };

  return {
    scripts: data?.data || [],
    isLoading,
    error,
    createScript,
    updateScript,
    deleteScript,
    incrementUseCount,
    refresh: mutate,
  };
}
