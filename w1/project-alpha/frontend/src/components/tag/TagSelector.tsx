// Project Alpha - TagSelector Component
import React, { useState } from 'react';
import { Tag as TagType } from '@/types';
import { useTagStore } from '@/store/tag.store';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Tag from './Tag';
import TagForm from './TagForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TagSelectorProps {
  selectedTagIds: number[];
  onSelectionChange: (tagIds: number[]) => void;
  className?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTagIds,
  onSelectionChange,
  className
}) => {
  const { tags, fetchTags } = useTagStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  React.useEffect(() => {
    fetchTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTagToggle = (tagId: number) => {
    const newSelection = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => id !== tagId)
      : [...selectedTagIds, tagId];
    onSelectionChange(newSelection);
  };

  const handleTagCreated = async () => {
    await fetchTags();
    setIsDialogOpen(false);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium">标签</label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Plus className="h-4 w-4 mr-1" />
              新建标签
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

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">暂无标签</p>
        ) : (
          tags.map((tag: TagType) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleTagToggle(tag.id)}
            >
              <Checkbox
                checked={selectedTagIds.includes(tag.id)}
                onCheckedChange={() => handleTagToggle(tag.id)}
              />
              <Tag tag={tag} variant="outline" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TagSelector;
