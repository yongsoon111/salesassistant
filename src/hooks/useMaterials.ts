import useSWR from 'swr';
import type { Material, ApiResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMaterials() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Material[]>>(
    '/api/materials',
    fetcher
  );

  const createMaterial = async (material: Omit<Material, 'id'>) => {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const updateMaterial = async (id: string, updates: Partial<Material>) => {
    const res = await fetch(`/api/materials/${id}`, {
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

  const deleteMaterial = async (id: string) => {
    const res = await fetch(`/api/materials/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const incrementUseCount = async (id: string) => {
    await fetch(`/api/materials/${id}/use`, { method: 'POST' });
    mutate();
  };

  return {
    materials: data?.data || [],
    isLoading,
    error,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    incrementUseCount,
    refresh: mutate,
  };
}
