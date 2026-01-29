'use client';

import { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Button } from '@/components/ui';
import type { Material } from '@/types';

interface MaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaterialFormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: Material;
}

export interface MaterialFormData {
  title: string;
  type: '포트폴리오' | '가격표' | '사례' | '계약서' | '기타';
  url: string;
  description: string;
  keywords: string[];
}

const materialTypes = ['포트폴리오', '가격표', '사례', '계약서', '기타'] as const;

export function MaterialFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
}: MaterialFormModalProps) {
  const [formData, setFormData] = useState<MaterialFormData>({
    title: '',
    type: '포트폴리오',
    url: '',
    description: '',
    keywords: [],
  });
  const [keywordsInput, setKeywordsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData && mode === 'edit') {
      setFormData({
        title: initialData.title,
        type: initialData.type,
        url: initialData.url,
        description: initialData.description,
        keywords: initialData.keywords,
      });
      setKeywordsInput(initialData.keywords.join(', '));
    } else if (isOpen && mode === 'create') {
      setFormData({
        title: '',
        type: '포트폴리오',
        url: '',
        description: '',
        keywords: [],
      });
      setKeywordsInput('');
    }
  }, [isOpen, initialData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const keywords = keywordsInput
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      await onSubmit({
        ...formData,
        keywords,
      });

      onClose();
    } catch (error) {
      console.error('Failed to submit material:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '자료 추가' : '자료 수정'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            제목
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="자료 제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            타입
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as MaterialFormData['type'],
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            {materialTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            URL
          </label>
          <Input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com/document"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            설명
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="자료에 대한 설명을 입력하세요"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            키워드
          </label>
          <Input
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            placeholder="키워드를 쉼표로 구분하여 입력하세요 (예: B2B, SaaS, 제조업)"
          />
          <p className="text-xs text-muted-foreground mt-1">
            쉼표(,)로 구분하여 여러 키워드를 입력할 수 있습니다
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : mode === 'create' ? '추가' : '수정'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
