'use client';

import { useState } from 'react';
import { Card, CardContent, Badge, CopyButton } from '@/components/ui';
import type { Script } from '@/types';

interface ScriptCardProps {
  script: Script;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const categoryColors: Record<string, string> = {
  '인사': 'bg-blue-500/20 text-blue-400',
  '라포': 'bg-green-500/20 text-green-400',
  '가치제안': 'bg-purple-500/20 text-purple-400',
  '반론처리': 'bg-orange-500/20 text-orange-400',
  '클로징': 'bg-red-500/20 text-red-400',
  '기타': 'bg-gray-500/20 text-gray-400',
};

export function ScriptCard({ script, onUse, onEdit, onDelete }: ScriptCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    onUse();
  };

  const handleDelete = () => {
    if (confirm('정말 이 스크립트를 삭제하시겠습니까?')) {
      onDelete();
    }
  };

  return (
    <Card
      className="hover:bg-accent/30 transition-colors group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium">{script.title}</h4>
              <Badge className={categoryColors[script.category] || categoryColors['기타']}>
                {script.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {script.content}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {script.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  #{keyword}
                </span>
              ))}
              <span className="text-xs text-muted-foreground ml-auto">
                {script.useCount}회 사용
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isHovered && (
              <div className="flex gap-1 animate-in fade-in-0 duration-200">
                <button
                  onClick={onEdit}
                  className="p-2 rounded hover:bg-accent transition-colors"
                  title="수정"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
                  title="삭제"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            )}
            <CopyButton text={script.content} onCopy={handleCopy} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
