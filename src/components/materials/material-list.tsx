'use client';

import { useState } from 'react';
import { useMaterials } from '@/hooks';
import { MaterialCard } from './material-card';
import { MaterialFormModal, MaterialFormData } from './material-form-modal';
import { Input, Button } from '@/components/ui';
import type { Material } from '@/types';

export function MaterialList() {
  const {
    materials,
    isLoading,
    incrementUseCount,
    createMaterial,
    updateMaterial,
    deleteMaterial,
  } = useMaterials();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();

  const types = ['포트폴리오', '가격표', '사례', '계약서', '기타'];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      !search ||
      material.title.toLowerCase().includes(search.toLowerCase()) ||
      material.description.toLowerCase().includes(search.toLowerCase()) ||
      material.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));

    const matchesType = !selectedType || material.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingMaterial(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (material: Material) => {
    setModalMode('edit');
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMaterial(undefined);
  };

  const handleSubmit = async (data: MaterialFormData) => {
    if (modalMode === 'create') {
      await createMaterial({
        ...data,
        useCount: 0,
      });
    } else if (editingMaterial) {
      await updateMaterial(editingMaterial.id, data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 이 자료를 삭제하시겠습니까?')) {
      await deleteMaterial(id);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">자료 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Input
            placeholder="자료 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                !selectedType
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              전체
            </button>
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={handleOpenCreateModal}>
          + 자료 추가
        </Button>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              onUse={() => incrementUseCount(material.id)}
              onEdit={() => handleOpenEditModal(material)}
              onDelete={() => handleDelete(material.id)}
            />
          ))}
        </div>
      )}

      <MaterialFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mode={modalMode}
        initialData={editingMaterial}
      />
    </div>
  );
}
