'use client';

import { useCustomers } from '@/hooks';

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  const { customers } = useCustomers();
  const activeCount = customers.filter((c) => c.status === '상담중').length;

  return (
    <header className="border-b border-border bg-card/30 backdrop-blur py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{activeCount}</span>
            명 상담 진행 중
          </div>
        </div>
      </div>
    </header>
  );
}
