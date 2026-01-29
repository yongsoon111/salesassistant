'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '어시스턴트', icon: '🎯' },
  { href: '/products', label: '상품/서비스', icon: '📦' },
  { href: '/customers', label: '고객 데이터베이스', icon: '👥' },
  { href: '/materials', label: '자료', icon: '📁' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          세일즈 어시스턴트
        </h1>
        <p className="text-xs text-muted-foreground mt-1">AI 세일즈 심리 전략</p>
      </div>

      <nav className="px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
