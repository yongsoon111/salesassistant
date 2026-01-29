'use client';

import { useState } from 'react';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import type { Material } from '@/types';

interface MaterialCardProps {
  material: Material;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const typeIcons: Record<string, string> = {
  '포트폴리오': '📊',
  '가격표': '💰',
  '사례': '📋',
  '계약서': '📄',
  '기타': '📁',
};

export function MaterialCard({ material, onUse, onEdit, onDelete }: MaterialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = () => {
    onUse();
    window.open(material.url, '_blank');
  };

  return (
    <Card
      className="hover:bg-accent/30 transition-colors relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{typeIcons[material.type] || '📁'}</span>
              <h4 className="font-medium">{material.title}</h4>
              <Badge variant="outline">{material.type}</Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {material.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {material.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                >
                  #{keyword}
                </span>
              ))}
              <span className="text-xs text-muted-foreground ml-auto">
                {material.useCount}회 사용
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isHovered && (
              <div className="flex gap-1 animate-in fade-in-0 duration-200">
                <button
                  onClick={onEdit}
                  className="p-1.5 rounded hover:bg-accent transition-colors"
                  title="수정"
                  aria-label="자료 수정"
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
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={onDelete}
                  className="p-1.5 rounded hover:bg-destructive/20 hover:text-destructive transition-colors"
                  title="삭제"
                  aria-label="자료 삭제"
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
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleOpen}>
              열기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
