// Project Alpha - Tag Component
// 性能优化：使用 React.memo 避免不必要的重渲染
import React, { memo, useMemo } from 'react';
import { Tag as TagType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

interface TagProps {
  tag: TagType;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  showCount?: boolean;
}

const Tag: React.FC<TagProps> = memo(({ tag, variant = 'default', className, showCount = false }) => {
  // 性能优化：使用 useMemo 缓存样式对象
  const badgeStyle = useMemo(() => ({
    backgroundColor: variant === 'default' ? tag.color : undefined,
    borderColor: variant === 'outline' ? tag.color : undefined,
    color: variant === 'default' ? '#fff' : undefined
  }), [variant, tag.color]);
  
  const dotStyle = useMemo(() => ({
    backgroundColor: variant === 'default' ? '#fff' : tag.color
  }), [variant, tag.color]);
  return (
    <Badge
      variant={variant}
      className={cn('flex items-center gap-1.5', className)}
      style={badgeStyle}
    >
      <div
        className="w-2 h-2 rounded-full"
        style={dotStyle}
      />
      <span>{tag.name}</span>
      {showCount && tag.ticketCount !== undefined && (
        <span className="ml-1 opacity-80">({tag.ticketCount})</span>
      )}
    </Badge>
  );
});

Tag.displayName = 'Tag';

export default Tag;
