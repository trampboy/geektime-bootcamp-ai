// Project Alpha - TagForm Component
import React, { useState } from 'react';
import { useTagStore } from '@/store/tag.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateTagDto } from '@/types';

interface TagFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DEFAULT_COLORS = [
  '#3B82F6', // 蓝色
  '#10B981', // 绿色
  '#EF4444', // 红色
  '#8B5CF6', // 紫色
  '#F59E0B', // 橙色
  '#EC4899', // 粉色
  '#06B6D4', // 青色
  '#84CC16', // 黄绿色
];

const TagForm: React.FC<TagFormProps> = ({ onSuccess, onCancel }) => {
  const { createTag } = useTagStore();
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('标签名称不能为空');
      return;
    }

    if (name.trim().length > 50) {
      setError('标签名称不能超过 50 个字符');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const dto: CreateTagDto = {
        name: name.trim(),
        color
      };
      await createTag(dto);
      setName('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || '创建标签失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tag-name">标签名称</Label>
        <Input
          id="tag-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="输入标签名称"
          maxLength={50}
          disabled={loading}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="space-y-2">
        <Label>颜色</Label>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`w-10 h-10 rounded-md border-2 transition-all ${
                color === c ? 'border-foreground scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
              disabled={loading}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-20 h-10"
            disabled={loading}
          />
          <span className="text-sm text-muted-foreground">或选择自定义颜色</span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            取消
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? '创建中...' : '创建标签'}
        </Button>
      </div>
    </form>
  );
};

export default TagForm;
