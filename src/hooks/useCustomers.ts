import useSWR from 'swr';
import type { Customer, ApiResponse } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCustomers() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Customer[]>>(
    '/api/customers',
    fetcher
  );

  const createCustomer = async (customer: Omit<Customer, 'id'>) => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    const res = await fetch(`/api/customers/${id}`, {
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

  const deleteCustomer = async (id: string) => {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  return {
    customers: data?.data || [],
    isLoading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refresh: mutate,
  };
}

export function useCustomer(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Customer>>(
    id ? `/api/customers/${id}` : null,
    fetcher
  );

  return {
    customer: data?.data,
    isLoading,
    error,
    refresh: mutate,
  };
}
