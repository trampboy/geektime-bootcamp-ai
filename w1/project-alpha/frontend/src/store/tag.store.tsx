// Project Alpha - Tag Store
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Tag, CreateTagDto } from '../types';
import tagService from '../services/tag.service';

interface TagContextType {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  getTagById: (id: number) => Promise<Tag | null>;
  createTag: (dto: CreateTagDto) => Promise<Tag>;
  deleteTag: (id: number) => Promise<void>;
  getTagTicketCount: (tagId: number) => Promise<number>;
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export const useTagStore = () => {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error('useTagStore must be used within TagProvider');
  }
  return context;
};

interface TagProviderProps {
  children: ReactNode;
}

export const TagProvider: React.FC<TagProviderProps> = ({ children }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tagService.getAllTags();
      setTags(data);
    } catch (err: any) {
      setError(err.message || '获取标签失败');
      console.error('Failed to fetch tags:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTagById = useCallback(async (id: number): Promise<Tag | null> => {
    try {
      setLoading(true);
      setError(null);
      const tag = await tagService.getTagById(id);
      return tag;
    } catch (err: any) {
      setError(err.message || '获取标签失败');
      console.error('Failed to get tag:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTag = useCallback(async (dto: CreateTagDto): Promise<Tag> => {
    try {
      setLoading(true);
      setError(null);
      const tag = await tagService.createTag(dto);
      await fetchTags(); // 刷新列表
      return tag;
    } catch (err: any) {
      setError(err.message || '创建标签失败');
      console.error('Failed to create tag:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTags]);

  const deleteTag = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await tagService.deleteTag(id);
      await fetchTags(); // 刷新列表
    } catch (err: any) {
      setError(err.message || '删除标签失败');
      console.error('Failed to delete tag:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTags]);

  const getTagTicketCount = useCallback(async (tagId: number): Promise<number> => {
    try {
      setError(null);
      const count = await tagService.getTagTicketCount(tagId);
      return count;
    } catch (err: any) {
      setError(err.message || '获取标签关联数量失败');
      console.error('Failed to get tag ticket count:', err);
      return 0;
    }
  }, []);

  const value: TagContextType = {
    tags,
    loading,
    error,
    fetchTags,
    getTagById,
    createTag,
    deleteTag,
    getTagTicketCount
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};
