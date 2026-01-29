'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';

interface ProductAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (productId: string) => void;
}

export function ProductAddModal({ isOpen, onClose, onSuccess }: ProductAddModalProps) {
  const { createProduct } = useProducts();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    benefits: '',
    priceRange: '',
    targetCustomer: '',
  });

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    setIsCreating(true);
    try {
      const result = await createProduct({
        name: formData.name,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        benefits: formData.benefits.split('\n').filter(b => b.trim()),
        priceRange: formData.priceRange,
        targetCustomer: formData.targetCustomer,
        isActive: true,
      });
      if (result?.id) {
        onSuccess(result.id);
        setFormData({
          name: '',
          shortDescription: '',
          fullDescription: '',
          benefits: '',
          priceRange: '',
          targetCustomer: '',
        });
      }
    } catch (error) {
      console.error('상품 생성 실패:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">새 상품 추가</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">상품명 *</label>
            <input
              type="text"
              className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
              placeholder="예: 구글맵 SEO"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">간단 설명</label>
            <input
              type="text"
              className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
              placeholder="한 줄 설명"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">상세 설명</label>
            <textarea
              className="w-full px-3 py-2 mt-1 rounded-md border border-input bg-background text-sm resize-none"
              rows={3}
              placeholder="상품에 대한 자세한 설명"
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">장점/혜택 (줄바꿈으로 구분)</label>
            <textarea
              className="w-full px-3 py-2 mt-1 rounded-md border border-input bg-background text-sm resize-none"
              rows={3}
              placeholder="외국인 고객 유치&#10;상위노출 보장&#10;실시간 관리"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">가격</label>
            <input
              type="text"
              className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
              placeholder="예: 3개국어 기준 90만원"
              value={formData.priceRange}
              onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">타겟 고객</label>
            <input
              type="text"
              className="w-full h-10 px-3 mt-1 rounded-md border border-input bg-background text-sm"
              placeholder="예: 외국인 관광객 대상 음식점"
              value={formData.targetCustomer}
              onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            disabled={isCreating || !formData.name.trim()}
          >
            {isCreating ? '생성 중...' : '추가'}
          </Button>
        </div>
      </div>
    </div>
  );
}
