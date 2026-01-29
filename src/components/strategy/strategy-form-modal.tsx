'use client';

import { useState, useEffect } from 'react';
import { Modal, Input, Textarea, Button } from '@/components/ui';
import type { Strategy } from '@/types';

interface StrategyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Strategy, 'id'>) => Promise<void>;
  mode: 'create' | 'edit';
  initialData?: Strategy;
}

export function StrategyFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
}: StrategyFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
    emotionGoal: '',
    persona: '',
    systemPrompt: '',
    isDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData && mode === 'edit') {
      setFormData({
        name: initialData.name,
        icon: initialData.icon,
        description: initialData.description,
        emotionGoal: initialData.emotionGoal,
        persona: initialData.persona,
        systemPrompt: initialData.systemPrompt,
        isDefault: initialData.isDefault,
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        name: '',
        icon: '',
        description: '',
        emotionGoal: '',
        persona: '',
        systemPrompt: '',
        isDefault: false,
      });
    }
  }, [isOpen, initialData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit strategy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '전략 추가' : '전략 수정'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              전략 이름 <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="예: 공감형 전략"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="icon" className="text-sm font-medium text-foreground">
              아이콘 <span className="text-destructive">*</span>
            </label>
            <Input
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="예: 🤝"
              maxLength={2}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-foreground">
            설명 <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="전략에 대한 간단한 설명을 입력하세요"
            className="min-h-[60px]"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="emotionGoal" className="text-sm font-medium text-foreground">
            감정 목표 <span className="text-destructive">*</span>
          </label>
          <Input
            id="emotionGoal"
            name="emotionGoal"
            value={formData.emotionGoal}
            onChange={handleChange}
            placeholder="예: 신뢰감 형성"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="persona" className="text-sm font-medium text-foreground">
            페르소나 <span className="text-destructive">*</span>
          </label>
          <Input
            id="persona"
            name="persona"
            value={formData.persona}
            onChange={handleChange}
            placeholder="예: 친근한 파트너"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="systemPrompt" className="text-sm font-medium text-foreground">
            시스템 프롬프트
          </label>
          <Textarea
            id="systemPrompt"
            name="systemPrompt"
            value={formData.systemPrompt}
            onChange={handleChange}
            placeholder="AI에게 전달할 상세한 지시사항을 입력하세요"
            className="min-h-[120px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-foreground">
            기본 전략으로 설정
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
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
