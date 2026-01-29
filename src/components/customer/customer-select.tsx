'use client';

import { useState } from 'react';
import { useCustomers } from '@/hooks';
import { getStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Customer, CustomerStatus } from '@/types';

interface CustomerSelectProps {
  selectedId: string | null;
  onSelect: (customer: Customer | null) => void;
  compact?: boolean;
}

const STATUS_OPTIONS: CustomerStatus[] = ['리드', '상담중', '제안', '계약', '해지'];

export function CustomerSelect({ selectedId, onSelect, compact = false }: CustomerSelectProps) {
  const { customers, isLoading, createCustomer } = useCustomers();
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    status: '리드' as CustomerStatus,
    notes: '',
  });

  const selected = customers.find((c) => c.id === selectedId);

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.company.trim()) return;

    setIsCreating(true);
    const today = new Date().toISOString().split('T')[0];
    try {
      const result = await createCustomer({
        ...formData,
        createdAt: today,
        lastContact: today,
      });
      if (result.success && result.data) {
        onSelect({
          id: result.data,
          ...formData,
          createdAt: today,
          lastContact: today,
        });
        setShowModal(false);
        setFormData({ name: '', company: '', status: '리드', notes: '' });
      }
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">로딩 중...</div>;
  }

  // 컴팩트 모드
  if (compact) {
    return (
      <>
        <div className="flex items-center gap-1">
          <select
            className="h-8 px-2 rounded-md border border-input bg-background text-sm"
            value={selectedId || ''}
            onChange={(e) => {
              const customer = customers.find((c) => c.id === e.target.value);
              onSelect(customer || null);
            }}
          >
            <option value="">선택 안함</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.company})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent"
            title="새 고객 추가"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* 고객 생성 모달 */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
            <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
              <h3 className="text-lg font-semibold mb-4">새 고객 추가</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">고객명 *</label>
                  <input
                    type="text"
                    className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                    placeholder="고객 이름"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">회사명 *</label>
                  <input
                    type="text"
                    className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                    placeholder="회사 이름"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">상태</label>
                  <select
                    className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">메모</label>
                  <textarea
                    className="w-full px-3 py-2 mt-1 rounded-md border border-input bg-background text-sm resize-none"
                    rows={3}
                    placeholder="고객에 대한 메모"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>취소</Button>
                <Button
                  type="button"
                  onClick={handleCreate}
                  disabled={isCreating || !formData.name.trim() || !formData.company.trim()}
                >
                  {isCreating ? '생성 중...' : '추가'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // 기본 모드
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">고객 선택</label>
      <div className="flex gap-2">
        <select
          className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
          value={selectedId || ''}
          onChange={(e) => {
            const customer = customers.find((c) => c.id === e.target.value);
            onSelect(customer || null);
          }}
        >
          <option value="">고객 선택 (선택사항)</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.company}) - {customer.status}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowModal(true)}
          title="새 고객 추가"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Button>
      </div>

      {selected && (
        <div className="p-3 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between">
            <span className="font-medium">{selected.name}</span>
            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selected.status)}`}>
              {selected.status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{selected.company}</p>
          {selected.notes && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{selected.notes}</p>
          )}
        </div>
      )}

      {/* 고객 생성 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
            <h3 className="text-lg font-semibold mb-4">새 고객 추가</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">고객명 *</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                  placeholder="고객 이름"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">회사명 *</label>
                <input
                  type="text"
                  className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                  placeholder="회사 이름"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">상태</label>
                <select
                  className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as CustomerStatus })}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">메모</label>
                <textarea
                  className="w-full px-3 py-2 mt-1 rounded-md border border-input bg-background text-sm resize-none"
                  rows={3}
                  placeholder="고객에 대한 메모"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleCreate}
                disabled={isCreating || !formData.name.trim() || !formData.company.trim()}
              >
                {isCreating ? '생성 중...' : '추가'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
