/**
 * Project Alpha - Ticket Service 单元测试
 */
import { TicketService } from '../../services/ticket.service';
import { AppError } from '../../middlewares/error.middleware';
import { TicketStatus } from '../../types';
import pool from '../../config/database';
import tagService from '../../services/tag.service';

// Mock 数据库连接
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    execute: jest.fn(),
    getConnection: jest.fn()
  }
}));

// Mock Tag Service
jest.mock('../../services/tag.service', () => ({
  __esModule: true,
  default: {
    getTagsByIds: jest.fn(),
    getTagById: jest.fn()
  }
}));

describe('TicketService', () => {
  let ticketService: TicketService;
  const mockPool = pool as jest.Mocked<typeof pool>;
  const mockTagService = tagService as jest.Mocked<typeof tagService>;

  beforeEach(() => {
    ticketService = new TicketService();
    jest.clearAllMocks();
  });

  describe('getAllTickets', () => {
    it('应该返回所有 Tickets', async () => {
      const mockTickets = [
        {
          id: 1,
          title: 'Test Ticket',
          description: 'Test Description',
          status: 'pending',
          createdAt: '2025-12-21T10:00:00.000Z',
          updatedAt: '2025-12-21T10:00:00.000Z'
        }
      ];
      const mockTags: any[] = [];

      mockPool.execute
        .mockResolvedValueOnce([mockTickets] as any)
        .mockResolvedValueOnce([mockTags] as any);

      const result = await ticketService.getAllTickets();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Ticket');
    });

    it('应该支持状态筛选', async () => {
      const mockTickets = [
        {
          id: 1,
          title: 'Pending Ticket',
          status: 'pending',
          createdAt: '2025-12-21T10:00:00.000Z',
          updatedAt: '2025-12-21T10:00:00.000Z'
        }
      ];
      const mockTags: any[] = [];

      mockPool.execute
        .mockResolvedValueOnce([mockTickets] as any)
        .mockResolvedValueOnce([mockTags] as any);

      const result = await ticketService.getAllTickets({ status: 'pending' });

      expect(result).toHaveLength(1);
      expect(mockPool.execute).toHaveBeenCalledWith(
        expect.stringContaining('status = ?'),
        ['pending']
      );
    });

    it('应该支持搜索筛选', async () => {
      const mockTickets = [
        {
          id: 1,
          title: 'Search Result',
          status: 'pending',
          createdAt: '2025-12-21T10:00:00.000Z',
          updatedAt: '2025-12-21T10:00:00.000Z'
        }
      ];
      const mockTags: any[] = [];

      mockPool.execute
        .mockResolvedValueOnce([mockTickets] as any)
        .mockResolvedValueOnce([mockTags] as any);

      const result = await ticketService.getAllTickets({ search: 'Search' });

      expect(result).toHaveLength(1);
      expect(mockPool.execute).toHaveBeenCalledWith(
        expect.stringContaining('LIKE'),
        expect.arrayContaining(['%Search%'])
      );
    });
  });

  describe('getTicketById', () => {
    it('应该返回指定 ID 的 Ticket', async () => {
      const mockTicket = [{
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: 'pending',
        createdAt: '2025-12-21T10:00:00.000Z',
        updatedAt: '2025-12-21T10:00:00.000Z'
      }];
      const mockTags: any[] = [];

      mockPool.execute
        .mockResolvedValueOnce([mockTicket] as any)
        .mockResolvedValueOnce([mockTags] as any);

      const result = await ticketService.getTicketById(1);

      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Ticket');
    });

    it('应该在 Ticket 不存在时抛出异常', async () => {
      mockPool.execute.mockResolvedValueOnce([[]] as any);

      try {
        await ticketService.getTicketById(999);
        fail('应该抛出异常');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe('Ticket 不存在');
        expect((error as AppError).statusCode).toBe(404);
      }
    });
  });

  describe('createTicket', () => {
    it('应该成功创建 Ticket', async () => {
      const mockConnection = {
        beginTransaction: jest.fn().mockResolvedValue(undefined),
        execute: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        release: jest.fn()
      };

      (mockPool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
      (mockConnection.execute as jest.Mock)
        .mockResolvedValueOnce([{ insertId: 1 }] as any) // INSERT ticket
        .mockResolvedValueOnce([{}] as any); // INSERT ticket_tags

      mockTagService.getTagsByIds.mockResolvedValue([
        { id: 1, name: 'Tag1', color: '#FF0000', createdAt: new Date() }
      ]);

      // Mock getTicketById 调用（createTicket 最后会调用它）
      // 注意：getTicketById 使用 pool.execute，不是 connection.execute
      // pool.execute 返回 [rows]，所以需要双重数组
      const mockTicketRow = {
        id: 1,
        title: 'New Ticket',
        description: 'New Description',
        status: 'pending',
        createdAt: '2025-12-21T10:00:00.000Z',
        updatedAt: '2025-12-21T10:00:00.000Z'
      };
      mockPool.execute
        .mockResolvedValueOnce([[mockTicketRow]] as any) // SELECT ticket - 返回 [rows]
        .mockResolvedValueOnce([[]] as any); // SELECT tags - 返回 [rows]

      const result = await ticketService.createTicket({
        title: 'New Ticket',
        description: 'New Description',
        tags: [1]
      });

      expect(result.title).toBe('New Ticket');
      expect(mockConnection.beginTransaction).toHaveBeenCalled();
      expect(mockConnection.commit).toHaveBeenCalled();
    });

    it('应该在标签不存在时抛出异常', async () => {
      const mockConnection = {
        beginTransaction: jest.fn().mockResolvedValue(undefined),
        execute: jest.fn(),
        rollback: jest.fn().mockResolvedValue(undefined),
        release: jest.fn()
      };

      (mockPool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
      (mockConnection.execute as jest.Mock)
        .mockResolvedValueOnce([{ insertId: 1 }] as any);

      mockTagService.getTagsByIds.mockResolvedValue([]);

      try {
        await ticketService.createTicket({
          title: 'New Ticket',
          tags: [999]
        });
        fail('应该抛出异常');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe('部分标签不存在');
        expect((error as AppError).statusCode).toBe(400);
        expect(mockConnection.rollback).toHaveBeenCalled();
      }
    });
  });

  describe('updateTicket', () => {
    it('应该成功更新 Ticket', async () => {
      const mockTicketRow = {
        id: 1,
        title: 'Updated Ticket',
        description: 'Updated Description',
        status: 'pending',
        createdAt: '2025-12-21T10:00:00.000Z',
        updatedAt: '2025-12-21T10:00:00.000Z'
      };
      const mockTags: any[] = [];

      // updateTicket 流程：
      // 1. getTicketById (检查存在) - SELECT ticket + SELECT tags
      // 2. UPDATE ticket
      // 3. getTicketById (返回结果) - SELECT ticket + SELECT tags
      mockPool.execute
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket (第一次)
        .mockResolvedValueOnce([mockTags] as any) // getTicketById - SELECT tags (第一次)
        .mockResolvedValueOnce([{}] as any) // UPDATE ticket
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket (第二次)
        .mockResolvedValueOnce([mockTags] as any); // getTicketById - SELECT tags (第二次)

      const result = await ticketService.updateTicket(1, {
        title: 'Updated Ticket',
        description: 'Updated Description'
      });

      expect(result.title).toBe('Updated Ticket');
    });

    it('应该在 Ticket 不存在时抛出异常', async () => {
      mockPool.execute.mockResolvedValueOnce([[]] as any);

      await expect(
        ticketService.updateTicket(999, { title: 'Updated' })
      ).rejects.toThrow(AppError);
    });

    it('应该在没有任何更新字段时抛出异常', async () => {
      const mockTicketRow = {
        id: 1,
        title: 'Test Ticket',
        status: 'pending',
        createdAt: '2025-12-21T10:00:00.000Z',
        updatedAt: '2025-12-21T10:00:00.000Z'
      };
      const mockTags: any[] = [];

      mockPool.execute
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket
        .mockResolvedValueOnce([mockTags] as any); // getTicketById - SELECT tags

      try {
        await ticketService.updateTicket(1, {});
        fail('应该抛出异常');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe('没有需要更新的字段');
        expect((error as AppError).statusCode).toBe(400);
      }
    });
  });

  describe('deleteTicket', () => {
    it('应该成功删除 Ticket', async () => {
      const mockTicketRow = {
        id: 1,
        title: 'Test Ticket',
        status: 'pending',
        createdAt: '2025-12-21T10:00:00.000Z',
        updatedAt: '2025-12-21T10:00:00.000Z'
      };
      const mockTags: any[] = [];

      mockPool.execute
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket
        .mockResolvedValueOnce([mockTags] as any) // getTicketById - SELECT tags
        .mockResolvedValueOnce([{}] as any); // DELETE ticket

      await ticketService.deleteTicket(1);

      expect(mockPool.execute).toHaveBeenCalledWith(
        expect.stringContaining('DELETE'),
        [1]
      );
    });
  });

  describe('updateTicketStatus', () => {
    it('应该成功更新 Ticket 状态', async () => {
      const mockTicketRow = {
        id: 1,
        title: 'Test Ticket',
        status: 'completed',
        createdAt: '2025-12-21T10:00:00.000Z',
        updatedAt: '2025-12-21T10:00:00.000Z'
      };
      const mockTags: any[] = [];

      mockPool.execute
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket (第一次)
        .mockResolvedValueOnce([mockTags] as any) // getTicketById - SELECT tags (第一次)
        .mockResolvedValueOnce([{}] as any) // UPDATE status
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket (第二次)
        .mockResolvedValueOnce([mockTags] as any); // getTicketById - SELECT tags (第二次)

      const result = await ticketService.updateTicketStatus(1, TicketStatus.COMPLETED);

      expect(result.status).toBe('completed');
    });
  });

  describe('setTicketTags', () => {
    it('应该成功设置 Ticket 标签', async () => {
      const mockConnection = {
        beginTransaction: jest.fn().mockResolvedValue(undefined),
        execute: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        release: jest.fn()
      };

      (mockPool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

      const mockTicketRow = {
        id: 1,
        title: 'Test Ticket',
        status: 'pending',
        createdAt: '2025-12-21T10:00:00.000Z',
        updatedAt: '2025-12-21T10:00:00.000Z'
      };
      const mockTags: any[] = [];

      mockTagService.getTagsByIds.mockResolvedValue([
        { id: 1, name: 'Tag1', color: '#FF0000', createdAt: new Date() },
        { id: 2, name: 'Tag2', color: '#00FF00', createdAt: new Date() }
      ]);

      // setTicketTags 流程：
      // 1. getTicketById (使用 pool.execute) - SELECT ticket + tags
      // 2. 事务中：DELETE tags, INSERT tags (使用 connection.execute)
      // 3. getTicketById (使用 pool.execute) - SELECT ticket + tags
      mockPool.execute
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket (第一次)
        .mockResolvedValueOnce([mockTags] as any) // getTicketById - SELECT tags (第一次)
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket (第二次)
        .mockResolvedValueOnce([mockTags] as any); // getTicketById - SELECT tags (第二次)

      (mockConnection.execute as jest.Mock)
        .mockResolvedValueOnce([{}] as any) // DELETE tags
        .mockResolvedValueOnce([{}] as any); // INSERT tags

      const result = await ticketService.setTicketTags(1, [1, 2]);

      expect(result.id).toBe(1);
      expect(mockConnection.commit).toHaveBeenCalled();
    });

    it('应该允许空标签数组（清除所有标签）', async () => {
      const mockConnection = {
        beginTransaction: jest.fn().mockResolvedValue(undefined),
        execute: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
        rollback: jest.fn().mockResolvedValue(undefined),
        release: jest.fn()
      };

      (mockPool.getConnection as jest.Mock).mockResolvedValue(mockConnection);

      const mockTicketRow = {
        id: 1,
        title: 'Test Ticket',
        status: 'pending',
        createdAt: '2025-12-21T10:00:00.000Z',
        updatedAt: '2025-12-21T10:00:00.000Z'
      };
      const mockTags: any[] = [];

      // setTicketTags 流程（空标签数组）：
      // 1. getTicketById (使用 pool.execute) - SELECT ticket + tags
      // 2. 事务中：DELETE tags (使用 connection.execute)
      // 3. getTicketById (使用 pool.execute) - SELECT ticket + tags
      mockPool.execute
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket (第一次)
        .mockResolvedValueOnce([mockTags] as any) // getTicketById - SELECT tags (第一次)
        .mockResolvedValueOnce([[mockTicketRow]] as any) // getTicketById - SELECT ticket (第二次)
        .mockResolvedValueOnce([mockTags] as any); // getTicketById - SELECT tags (第二次)

      (mockConnection.execute as jest.Mock)
        .mockResolvedValueOnce([{}] as any); // DELETE tags

      const result = await ticketService.setTicketTags(1, []);

      expect(result.id).toBe(1);
      expect(mockConnection.execute).not.toHaveBeenCalledWith(
        expect.stringContaining('INSERT'),
        expect.anything()
      );
    });
  });
});
