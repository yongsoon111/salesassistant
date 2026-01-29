'use client';

import { useCustomers } from '@/hooks';
import { Card, CardContent, Badge } from '@/components/ui';
import { formatRelativeTime, getStatusColor } from '@/lib/utils';
import type { Customer } from '@/types';

interface CustomerListProps {
  onSelect?: (customer: Customer) => void;
  selectedId?: string | null;
}

export function CustomerList({ onSelect, selectedId }: CustomerListProps) {
  const { customers, isLoading } = useCustomers();

  if (isLoading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        고객 목록 로딩 중...
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        등록된 고객이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {customers.map((customer) => (
        <Card
          key={customer.id}
          className={`cursor-pointer transition-colors hover:bg-accent/50 ${
            selectedId === customer.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => onSelect?.(customer)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{customer.name}</h4>
                <p className="text-sm text-muted-foreground">{customer.company}</p>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(customer.lastContact)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
