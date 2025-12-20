// Project Alpha - Tag Component
import React from 'react';
import { Tag as TagType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

interface TagProps {
  tag: TagType;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  showCount?: boolean;
}

const Tag: React.FC<TagProps> = ({ tag, variant = 'default', className, showCount = false }) => {
  return (
    <Badge
      variant={variant}
      className={cn('flex items-center gap-1.5', className)}
      style={{
        backgroundColor: variant === 'default' ? tag.color : undefined,
        borderColor: variant === 'outline' ? tag.color : undefined,
        color: variant === 'default' ? '#fff' : undefined
      }}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: variant === 'default' ? '#fff' : tag.color }}
      />
      <span>{tag.name}</span>
      {showCount && tag.ticketCount !== undefined && (
        <span className="ml-1 opacity-80">({tag.ticketCount})</span>
      )}
    </Badge>
  );
};

export default Tag;
