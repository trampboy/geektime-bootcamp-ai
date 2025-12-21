// Project Alpha - TicketCard Component
// 性能优化：使用 React.memo 避免不必要的重渲染
import React, { useCallback, memo } from 'react';
import { Ticket, TicketStatus } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CheckCircle2, Circle } from 'lucide-react';
import Tag from '@/components/tag/Tag';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
  onStatusChange: (ticket: Ticket, status: TicketStatus) => void;
}

const TicketCard: React.FC<TicketCardProps> = memo(({
  ticket,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const isCompleted = ticket.status === TicketStatus.COMPLETED;
  
  // 性能优化：使用 useCallback 避免函数重新创建
  const handleEdit = useCallback(() => onEdit(ticket), [onEdit, ticket]);
  const handleDelete = useCallback(() => onDelete(ticket), [onDelete, ticket]);
  const handleStatusToggle = useCallback(() => {
    onStatusChange(ticket, isCompleted ? TicketStatus.PENDING : TicketStatus.COMPLETED);
  }, [onStatusChange, ticket, isCompleted]);

  return (
    <Card className={cn('hover:shadow-md transition-shadow', isCompleted && 'opacity-75')}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className={cn('text-lg font-semibold line-clamp-2', isCompleted && 'line-through')}>
              {ticket.title}
            </h3>
            {ticket.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {ticket.description}
              </p>
            )}
          </div>
          <Badge variant={isCompleted ? 'secondary' : 'default'}>
            {isCompleted ? '已完成' : '进行中'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 标签 */}
          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <Tag key={tag.id} tag={tag} />
              ))}
            </div>
          )}

          {/* 时间和操作 */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xs text-muted-foreground">
              <div>创建: {formatDate(ticket.createdAt)}</div>
              {ticket.updatedAt !== ticket.createdAt && (
                <div>更新: {formatDate(ticket.updatedAt)}</div>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleStatusToggle}
                title={isCompleted ? '标记为进行中' : '标记为已完成'}
              >
                {isCompleted ? (
                  <Circle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleEdit}
                title="编辑"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={handleDelete}
                title="删除"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

TicketCard.displayName = 'TicketCard';

export default TicketCard;
