/**
 * Project Alpha - Tag Service 单元测试
 */
import { TagService } from '../../services/tag.service';
import { AppError } from '../../middlewares/error.middleware';
import pool from '../../config/database';

// Mock 数据库连接
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    execute: jest.fn()
  }
}));

describe('TagService', () => {
  let tagService: TagService;
  const mockPool = pool as jest.Mocked<typeof pool>;

  beforeEach(() => {
    tagService = new TagService();
    jest.clearAllMocks();
  });

  describe('getAllTags', () => {
    it('应该返回所有标签', async () => {
      const mockTags = [
        { id: 1, name: '后端', color: '#3B82F6', createdAt: '2025-12-21T10:00:00.000Z' },
        { id: 2, name: '前端', color: '#10B981', createdAt: '2025-12-21T10:00:00.000Z' }
      ];

      mockPool.execute.mockResolvedValueOnce([mockTags] as any);

      const result = await tagService.getAllTags();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('后端');
      expect(result[1].name).toBe('前端');
      expect(mockPool.execute).toHaveBeenCalledTimes(1);
    });

    it('应该在数据库错误时抛出异常', async () => {
      mockPool.execute.mockRejectedValueOnce(new Error('Database error'));

      await expect(tagService.getAllTags()).rejects.toThrow(AppError);
      await expect(tagService.getAllTags()).rejects.toThrow('获取标签列表失败');
    });
  });

  describe('getTagById', () => {
    it('应该返回指定 ID 的标签', async () => {
      const mockTag = [{ id: 1, name: '后端', color: '#3B82F6', createdAt: '2025-12-21T10:00:00.000Z' }];

      mockPool.execute.mockResolvedValueOnce([mockTag] as any);

      const result = await tagService.getTagById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('后端');
      expect(mockPool.execute).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [1]
      );
    });

    it('应该在标签不存在时抛出异常', async () => {
      // Mock 返回空数组（标签不存在）
      mockPool.execute.mockResolvedValueOnce([[]] as any);

      try {
        await tagService.getTagById(999);
        fail('应该抛出异常');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe('标签不存在');
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).code).toBe('TAG_NOT_FOUND');
      }
    });
  });

  describe('createTag', () => {
    it('应该成功创建标签', async () => {
      const mockInsertResult = { insertId: 1 };
      const mockTag = [{ id: 1, name: '新标签', color: '#FF0000', createdAt: '2025-12-21T10:00:00.000Z' }];

      mockPool.execute
        .mockResolvedValueOnce([mockInsertResult] as any)
        .mockResolvedValueOnce([mockTag] as any);

      const result = await tagService.createTag({
        name: '新标签',
        color: '#FF0000'
      });

      expect(result.id).toBe(1);
      expect(result.name).toBe('新标签');
      expect(result.color).toBe('#FF0000');
    });

    it('应该使用默认颜色如果未提供', async () => {
      const mockInsertResult = { insertId: 1 };
      const mockTag = [{ id: 1, name: '新标签', color: '#3B82F6', createdAt: '2025-12-21T10:00:00.000Z' }];

      mockPool.execute
        .mockResolvedValueOnce([mockInsertResult] as any)
        .mockResolvedValueOnce([mockTag] as any);

      const result = await tagService.createTag({
        name: '新标签'
      });

      expect(result.color).toBe('#3B82F6');
    });

    it('应该拒绝无效的颜色格式', async () => {
      await expect(
        tagService.createTag({
          name: '无效标签',
          color: 'invalid-color'
        })
      ).rejects.toThrow(AppError);
      await expect(
        tagService.createTag({
          name: '无效标签',
          color: 'invalid-color'
        })
      ).rejects.toThrow('颜色格式不正确');
    });

    it('应该在标签名称重复时抛出异常', async () => {
      const mysqlError: any = new Error('Duplicate entry');
      mysqlError.code = 'ER_DUP_ENTRY';

      mockPool.execute.mockRejectedValueOnce(mysqlError);

      try {
        await tagService.createTag({
          name: '重复标签',
          color: '#FF0000'
        });
        fail('应该抛出异常');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe('标签名称已存在');
        expect((error as AppError).statusCode).toBe(409);
        expect((error as AppError).code).toBe('DUPLICATE_TAG');
      }
    });
  });

  describe('deleteTag', () => {
    it('应该成功删除标签', async () => {
      const mockTag = [{ id: 1, name: '后端', color: '#3B82F6', createdAt: '2025-12-21T10:00:00.000Z' }];

      mockPool.execute
        .mockResolvedValueOnce([mockTag] as any)
        .mockResolvedValueOnce([{}] as any);

      await tagService.deleteTag(1);

      expect(mockPool.execute).toHaveBeenCalledTimes(2);
    });

    it('应该在标签不存在时抛出异常', async () => {
      // deleteTag 内部会调用 getTagById，所以需要 mock 两次
      mockPool.execute.mockResolvedValueOnce([[]] as any); // getTagById 返回空

      try {
        await tagService.deleteTag(999);
        fail('应该抛出异常');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe('标签不存在');
        expect((error as AppError).statusCode).toBe(404);
      }
    });
  });

  describe('getTagTicketCount', () => {
    it('应该返回标签关联的 Ticket 数量', async () => {
      mockPool.execute.mockResolvedValueOnce([[{ count: 5 }]] as any);

      const count = await tagService.getTagTicketCount(1);

      expect(count).toBe(5);
      expect(mockPool.execute).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        [1]
      );
    });
  });

  describe('getTagsByIds', () => {
    it('应该返回指定 ID 列表的标签', async () => {
      const mockTags = [
        { id: 1, name: '后端', color: '#3B82F6', createdAt: '2025-12-21T10:00:00.000Z' },
        { id: 2, name: '前端', color: '#10B981', createdAt: '2025-12-21T10:00:00.000Z' }
      ];

      mockPool.execute.mockResolvedValueOnce([mockTags] as any);

      const result = await tagService.getTagsByIds([1, 2]);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('应该在 ID 列表为空时返回空数组', async () => {
      const result = await tagService.getTagsByIds([]);

      expect(result).toEqual([]);
      expect(mockPool.execute).not.toHaveBeenCalled();
    });
  });
});
