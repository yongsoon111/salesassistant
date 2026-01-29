'use client';

import { useState } from 'react';
import { useScripts } from '@/hooks';
import { ScriptCard } from './script-card';
import { ScriptFormModal, type ScriptFormData } from './script-form-modal';
import { Input, Button } from '@/components/ui';
import type { Script } from '@/types';

export function ScriptList() {
  const { scripts, isLoading, incrementUseCount, createScript, updateScript, deleteScript } = useScripts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingScript, setEditingScript] = useState<Script | undefined>(undefined);

  const categories = ['인사', '라포', '가치제안', '반론처리', '클로징', '기타'];

  const filteredScripts = scripts.filter((script) => {
    const matchesSearch =
      !search ||
      script.title.toLowerCase().includes(search.toLowerCase()) ||
      script.content.toLowerCase().includes(search.toLowerCase()) ||
      script.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = !selectedCategory || script.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingScript(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (script: Script) => {
    setModalMode('edit');
    setEditingScript(script);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScript(undefined);
  };

  const handleSubmit = async (data: ScriptFormData) => {
    if (modalMode === 'create') {
      await createScript({
        ...data,
        useCount: 0,
        isActive: true,
      });
    } else if (editingScript) {
      await updateScript(editingScript.id, data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteScript(id);
  };

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">스크립트 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Input
            placeholder="스크립트 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                !selectedCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              전체
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={handleOpenCreateModal} size="default">
          + 스크립트 추가
        </Button>
      </div>

      {filteredScripts.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onUse={() => incrementUseCount(script.id)}
              onEdit={() => handleOpenEditModal(script)}
              onDelete={() => handleDelete(script.id)}
            />
          ))}
        </div>
      )}

      <ScriptFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        mode={modalMode}
        initialData={editingScript}
      />
    </div>
  );
}
