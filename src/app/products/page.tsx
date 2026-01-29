'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { Modal } from '@/components/ui/modal';
import type { Product } from '@/types';

export default function ProductsPage() {
  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    benefits: '',
    priceRange: '',
    targetCustomer: '',
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      shortDescription: '',
      fullDescription: '',
      benefits: '',
      priceRange: '',
      targetCustomer: '',
      isActive: true,
    });
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      benefits: product.benefits.join(', '),
      priceRange: product.priceRange,
      targetCustomer: product.targetCustomer,
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      shortDescription: formData.shortDescription,
      fullDescription: formData.fullDescription,
      benefits: formData.benefits.split(',').map(b => b.trim()).filter(Boolean),
      priceRange: formData.priceRange,
      targetCustomer: formData.targetCustomer,
      isActive: formData.isActive,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productData);
    } else {
      await createProduct(productData);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteProduct(id);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full p-6 lg:p-8 overflow-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">상품/서비스 관리</h1>
          <p className="text-muted-foreground">판매하는 상품 및 서비스 정보를 관리합니다</p>
        </div>
        <Button onClick={openCreateModal}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          상품 추가
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium mb-2">등록된 상품이 없습니다</h3>
            <p className="text-muted-foreground mb-4">
              상품을 추가하면 메시지 생성 시 상품 정보가 자동으로 반영됩니다
            </p>
            <Button onClick={openCreateModal}>첫 상품 추가하기</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-xl">📦</span>
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.shortDescription}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(product)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.fullDescription && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.fullDescription}
                  </p>
                )}
                {product.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  {product.priceRange && (
                    <span className="text-muted-foreground">💰 {product.priceRange}</span>
                  )}
                  {product.targetCustomer && (
                    <span className="text-muted-foreground">🎯 {product.targetCustomer}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? '상품 수정' : '새 상품 추가'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">상품명 *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="예: 플레이스 마케팅 서비스"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">한 줄 설명</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="예: 네이버 플레이스 상위노출 마케팅"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">상세 설명</label>
            <textarea
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px]"
              placeholder="상품/서비스에 대한 자세한 설명을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">핵심 혜택 (쉼표로 구분)</label>
            <input
              type="text"
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="예: 매출 증가, 브랜드 인지도 상승, 신규 고객 유입"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">가격대</label>
              <input
                type="text"
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="예: 월 50만원~"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">타겟 고객</label>
              <input
                type="text"
                value={formData.targetCustomer}
                onChange={(e) => setFormData({ ...formData, targetCustomer: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="예: 소상공인, 자영업자"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-border"
            />
            <label htmlFor="isActive" className="text-sm">활성화</label>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              취소
            </Button>
            <Button type="submit" className="flex-1">
              {editingProduct ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
