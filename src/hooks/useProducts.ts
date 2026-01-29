'use client';

import useSWR from 'swr';
import type { Product } from '@/types';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>('/api/products', fetcher);

  const createProduct = async (productData: Omit<Product, 'id'>) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('상품 생성 실패');
    mutate();
    return response.json();
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('상품 수정 실패');
    mutate();
    return response.json();
  };

  const deleteProduct = async (id: string) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('상품 삭제 실패');
    mutate();
  };

  return {
    products: data || [],
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    mutate,
    refetch: mutate,
  };
}
