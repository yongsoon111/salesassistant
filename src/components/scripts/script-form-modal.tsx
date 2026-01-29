'use client';

import { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Button } from '@/components/ui';
import type { Script } from '@/types';

interface ScriptFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScriptFormData) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: Script;
}

export interface ScriptFormData {
  title: string;
  category: '인사' | '라포' | '가치제안' | '반론처리' | '클로징' | '기타';
  content: string;
  keywords: string[];
}

const categories = ['인사', '라포', '가치제안', '반론처리', '클로징', '기타'] as const;

export function ScriptFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData
}: ScriptFormModalProps) {
  const [formData, setFormData] = useState<ScriptFormData>({
    title: '',
    category: '기타',
    content: '',
    keywords: [],
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        content: initialData.content,
        keywords: initialData.keywords,
      });
    } else if (!isOpen) {
      resetForm();
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setFormData({
      title: '',
      category: '기타',
      content: '',
      keywords: [],
    });
    setKeywordInput('');
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed && !formData.keywords.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, trimmed],
      }));
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword),
    }));
  };

  const handleKeywordInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '스크립트 추가' : '스크립트 수정'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            제목
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="스크립트 제목을 입력하세요"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            카테고리
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              category: e.target.value as typeof formData.category
            }))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            내용
          </label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="스크립트 내용을 입력하세요"
            rows={6}
            required
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium mb-2">
            키워드
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              id="keywords"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordInputKeyDown}
              placeholder="키워드 입력 후 Enter"
            />
            <Button
              type="button"
              onClick={handleAddKeyword}
              variant="outline"
              size="default"
            >
              추가
            </Button>
          </div>
          {formData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-muted text-sm"
                >
                  #{keyword}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? '처리 중...' : mode === 'create' ? '추가' : '수정'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
