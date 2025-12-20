// Project Alpha - FilterBar Component
import React from 'react';
import { Button } from '@/components/ui/button';
import { TicketStatus } from '@/types';
import { cn } from '@/utils/cn';

interface FilterBarProps {
  status: 'pending' | 'completed' | 'all';
  onStatusChange: (status: 'pending' | 'completed' | 'all') => void;
  className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ status, onStatusChange, className }) => {
  const filters = [
    { value: 'all' as const, label: '全部' },
    { value: 'pending' as const, label: '进行中' },
    { value: 'completed' as const, label: '已完成' },
  ];

  return (
    <div className={cn('flex gap-2', className)}>
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={status === filter.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onStatusChange(filter.value)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default FilterBar;
