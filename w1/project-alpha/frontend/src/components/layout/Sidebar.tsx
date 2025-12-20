// Project Alpha - Sidebar Component
import React, { useEffect } from 'react';
import { useTagStore } from '@/store/tag.store';
import { Tag } from '@/types';
import { Badge } from '@/components/ui/badge';

const Sidebar: React.FC = () => {
  const { tags, loading, fetchTags } = useTagStore();

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="w-64 border-r bg-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">标签筛选</h2>
        {loading ? (
          <div className="text-sm text-muted-foreground">加载中...</div>
        ) : tags.length === 0 ? (
          <div className="text-sm text-muted-foreground">暂无标签</div>
        ) : (
          <div className="space-y-2">
            {tags.map((tag: Tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm">{tag.name}</span>
                </div>
                {tag.ticketCount !== undefined && (
                  <Badge variant="secondary" className="text-xs">
                    {tag.ticketCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
