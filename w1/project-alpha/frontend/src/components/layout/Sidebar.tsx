// Project Alpha - Sidebar Component
import React, { useEffect } from 'react';
import { useTagStore } from '@/store/tag.store';
import { useTicketStore } from '@/store/ticket.store';
import { Tag } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TagForm from '@/components/tag/TagForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Sidebar: React.FC = () => {
  const { tags, loading, fetchTags } = useTagStore();
  const { filters, setFilters } = useTicketStore();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedTagIds = filters.tags || [];

  const handleTagToggle = (tagId: number) => {
    const newTagIds = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    setFilters({ ...filters, tags: newTagIds });
  };

  const handleTagCreated = async () => {
    await fetchTags();
    setIsDialogOpen(false);
  };

  return (
    <aside className="w-64 border-r bg-card p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">标签筛选</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>创建新标签</DialogTitle>
                <DialogDescription>创建一个新的标签用于分类 Tickets</DialogDescription>
              </DialogHeader>
              <TagForm onSuccess={handleTagCreated} />
            </DialogContent>
          </Dialog>
        </div>
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
                onClick={() => handleTagToggle(tag.id)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTagIds.includes(tag.id)}
                    onCheckedChange={() => handleTagToggle(tag.id)}
                  />
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
