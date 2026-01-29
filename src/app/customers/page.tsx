'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { useCustomers } from '@/hooks';
import { getStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { CustomerStatus } from '@/types';

const STATUS_OPTIONS: CustomerStatus[] = ['리드', '상담중', '제안', '계약', '해지'];

export default function CustomersPage() {
  const { customers, isLoading, createCustomer, deleteCustomer } = useCustomers();
  const [showModal, setShowModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    status: '리드' as CustomerStatus,
    notes: '',
  });

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.company.trim()) return;

    setIsCreating(true);
    const today = new Date().toISOString().split('T')[0];
    try {
      await createCustomer({
        ...formData,
        createdAt: today,
        lastContact: today,
      });
      setShowModal(false);
      setFormData({ name: '', company: '', status: '리드', notes: '' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteCustomer(id);
    }
  };

  return (
    <div className="h-full p-6 lg:p-8 overflow-auto">
      <Header
        title="고객 데이터베이스"
        description="고객 정보를 관리합니다"
      />

      <div className="mt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">고객 목록 ({customers.length})</h2>
            <Button onClick={() => setShowModal(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              고객 추가
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              등록된 고객이 없습니다
            </div>
          ) : (
            <div className="space-y-3">
              {customers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-4 rounded-lg bg-card border border-border"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{customer.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(customer.status)}`}>
                          {customer.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{customer.company}</p>
                      {customer.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{customer.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
              <Button variant="outline" onClick={() => setShowModal(false)}>취소</Button>
              <Button
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
