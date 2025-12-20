// Project Alpha - TicketForm Component
import React, { useState, useEffect } from 'react';
import { Ticket, CreateTicketDto, UpdateTicketDto } from '@/types';
import { useTicketStore } from '@/store/ticket.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TagSelector from '@/components/tag/TagSelector';
import { Textarea } from '@/components/ui/textarea';

interface TicketFormProps {
  ticket?: Ticket;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ ticket, onSuccess, onCancel }) => {
  const { createTicket, updateTicket, setTicketTags } = useTicketStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!ticket;

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description || '');
      setSelectedTagIds(ticket.tags?.map(t => t.id) || []);
    }
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('标题不能为空');
      return;
    }

    if (title.trim().length > 255) {
      setError('标题不能超过 255 个字符');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isEditMode && ticket) {
        const dto: UpdateTicketDto = {
          title: title.trim(),
          description: description.trim() || undefined
        };
        await updateTicket(ticket.id, dto);
        // 更新标签
        await setTicketTags(ticket.id, selectedTagIds);
      } else {
        const dto: CreateTicketDto = {
          title: title.trim(),
          description: description.trim() || undefined,
          tags: selectedTagIds.length > 0 ? selectedTagIds : undefined
        };
        await createTicket(dto);
      }

      // 重置表单
      setTitle('');
      setDescription('');
      setSelectedTagIds([]);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || (isEditMode ? '更新 Ticket 失败' : '创建 Ticket 失败'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ticket-title">标题 *</Label>
        <Input
          id="ticket-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError(null);
          }}
          placeholder="输入 Ticket 标题"
          maxLength={255}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ticket-description">描述</Label>
        <Textarea
          id="ticket-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="输入 Ticket 描述（可选）"
          rows={4}
          disabled={loading}
        />
      </div>

      <TagSelector
        selectedTagIds={selectedTagIds}
        onSelectionChange={setSelectedTagIds}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            取消
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? (isEditMode ? '更新中...' : '创建中...') : (isEditMode ? '更新' : '创建')}
        </Button>
      </div>
    </form>
  );
};

export default TicketForm;
