import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TagService } from '@/services/tag.service';
import api from '@/services/api';
import { Tag, CreateTagDto } from '@/types';

// Mock api
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('TagService', () => {
  let tagService: TagService;

  beforeEach(() => {
    tagService = new TagService();
    vi.clearAllMocks();
  });

  describe('getAllTags', () => {
    it('应该获取所有标签', async () => {
      const mockTags: Tag[] = [
        {
          id: 1,
          name: 'Tag 1',
          color: '#ff0000',
        },
        {
          id: 2,
          name: 'Tag 2',
          color: '#00ff00',
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: mockTags,
      });

      const result = await tagService.getAllTags();
      expect(result).toEqual(mockTags);
      expect(api.get).toHaveBeenCalledWith('/tags');
    });

    it('应该返回空数组当没有数据时', async () => {
      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: [],
      });

      const result = await tagService.getAllTags();
      expect(result).toEqual([]);
    });
  });

  describe('getTagById', () => {
    it('应该根据 ID 获取标签', async () => {
      const mockTag: Tag = {
        id: 1,
        name: 'Test Tag',
        color: '#ff0000',
      };

      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: mockTag,
      });

      const result = await tagService.getTagById(1);
      expect(result).toEqual(mockTag);
      expect(api.get).toHaveBeenCalledWith('/tags/1');
    });
  });

  describe('createTag', () => {
    it('应该创建新标签', async () => {
      const dto: CreateTagDto = {
        name: 'New Tag',
        color: '#0000ff',
      };

      const mockTag: Tag = {
        id: 1,
        ...dto,
      };

      vi.mocked(api.post).mockResolvedValue({
        success: true,
        data: mockTag,
      });

      const result = await tagService.createTag(dto);
      expect(result).toEqual(mockTag);
      expect(api.post).toHaveBeenCalledWith('/tags', dto);
    });

    it('应该支持不带颜色的标签', async () => {
      const dto: CreateTagDto = {
        name: 'New Tag',
      };

      const mockTag: Tag = {
        id: 1,
        name: 'New Tag',
        color: '#000000',
      };

      vi.mocked(api.post).mockResolvedValue({
        success: true,
        data: mockTag,
      });

      const result = await tagService.createTag(dto);
      expect(result).toEqual(mockTag);
    });
  });

  describe('deleteTag', () => {
    it('应该删除标签', async () => {
      vi.mocked(api.delete).mockResolvedValue({
        success: true,
      });

      await tagService.deleteTag(1);
      expect(api.delete).toHaveBeenCalledWith('/tags/1');
    });
  });

  describe('getTagTicketCount', () => {
    it('应该获取标签关联的 ticket 数量', async () => {
      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: { count: 5 },
      });

      const result = await tagService.getTagTicketCount(1);
      expect(result).toBe(5);
      expect(api.get).toHaveBeenCalledWith('/tags/1/ticket-count');
    });

    it('应该返回 0 当没有关联的 ticket 时', async () => {
      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: { count: 0 },
      });

      const result = await tagService.getTagTicketCount(1);
      expect(result).toBe(0);
    });

    it('应该返回 0 当响应中没有 count 字段时', async () => {
      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: {},
      });

      const result = await tagService.getTagTicketCount(1);
      expect(result).toBe(0);
    });
  });
});
