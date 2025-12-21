import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TicketService } from '@/services/ticket.service';
import api from '@/services/api';
import { TicketStatus, Ticket, CreateTicketDto, UpdateTicketDto } from '@/types';

// Mock api
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('TicketService', () => {
  let ticketService: TicketService;

  beforeEach(() => {
    ticketService = new TicketService();
    vi.clearAllMocks();
  });

  describe('getAllTickets', () => {
    it('应该获取所有 tickets', async () => {
      const mockTickets: Ticket[] = [
        {
          id: 1,
          title: 'Test Ticket',
          status: TicketStatus.PENDING,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          tags: [],
        },
      ];

      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: mockTickets,
      });

      const result = await ticketService.getAllTickets();
      expect(result).toEqual(mockTickets);
      expect(api.get).toHaveBeenCalledWith('/tickets', { params: {} });
    });

    it('应该支持状态筛选', async () => {
      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: [],
      });

      await ticketService.getAllTickets({ status: TicketStatus.PENDING });
      expect(api.get).toHaveBeenCalledWith('/tickets', {
        params: { status: TicketStatus.PENDING },
      });
    });

    it('应该支持搜索筛选', async () => {
      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: [],
      });

      await ticketService.getAllTickets({ search: 'test' });
      expect(api.get).toHaveBeenCalledWith('/tickets', {
        params: { search: 'test' },
      });
    });

    it('应该支持标签筛选', async () => {
      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: [],
      });

      await ticketService.getAllTickets({ tags: [1, 2, 3] });
      expect(api.get).toHaveBeenCalledWith('/tickets', {
        params: { tags: '1,2,3' },
      });
    });
  });

  describe('getTicketById', () => {
    it('应该根据 ID 获取 ticket', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        status: TicketStatus.PENDING,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
      };

      vi.mocked(api.get).mockResolvedValue({
        success: true,
        data: mockTicket,
      });

      const result = await ticketService.getTicketById(1);
      expect(result).toEqual(mockTicket);
      expect(api.get).toHaveBeenCalledWith('/tickets/1');
    });
  });

  describe('createTicket', () => {
    it('应该创建新的 ticket', async () => {
      const dto: CreateTicketDto = {
        title: 'New Ticket',
        description: 'Description',
      };

      const mockTicket: Ticket = {
        id: 1,
        ...dto,
        status: TicketStatus.PENDING,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
      };

      vi.mocked(api.post).mockResolvedValue({
        success: true,
        data: mockTicket,
      });

      const result = await ticketService.createTicket(dto);
      expect(result).toEqual(mockTicket);
      expect(api.post).toHaveBeenCalledWith('/tickets', dto);
    });
  });

  describe('updateTicket', () => {
    it('应该更新 ticket', async () => {
      const dto: UpdateTicketDto = {
        title: 'Updated Title',
      };

      const mockTicket: Ticket = {
        id: 1,
        title: 'Updated Title',
        status: TicketStatus.PENDING,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
      };

      vi.mocked(api.put).mockResolvedValue({
        success: true,
        data: mockTicket,
      });

      const result = await ticketService.updateTicket(1, dto);
      expect(result).toEqual(mockTicket);
      expect(api.put).toHaveBeenCalledWith('/tickets/1', dto);
    });
  });

  describe('deleteTicket', () => {
    it('应该删除 ticket', async () => {
      vi.mocked(api.delete).mockResolvedValue({
        success: true,
      });

      await ticketService.deleteTicket(1);
      expect(api.delete).toHaveBeenCalledWith('/tickets/1');
    });
  });

  describe('updateTicketStatus', () => {
    it('应该更新 ticket 状态', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        status: TicketStatus.COMPLETED,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
      };

      vi.mocked(api.patch).mockResolvedValue({
        success: true,
        data: mockTicket,
      });

      const result = await ticketService.updateTicketStatus(1, TicketStatus.COMPLETED);
      expect(result).toEqual(mockTicket);
      expect(api.patch).toHaveBeenCalledWith('/tickets/1/status', {
        status: TicketStatus.COMPLETED,
      });
    });
  });

  describe('setTicketTags', () => {
    it('应该设置 ticket 标签', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        status: TicketStatus.PENDING,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
      };

      vi.mocked(api.put).mockResolvedValue({
        success: true,
        data: mockTicket,
      });

      const result = await ticketService.setTicketTags(1, [1, 2, 3]);
      expect(result).toEqual(mockTicket);
      expect(api.put).toHaveBeenCalledWith('/tickets/1/tags', { tags: [1, 2, 3] });
    });
  });

  describe('addTagToTicket', () => {
    it('应该添加标签到 ticket', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        status: TicketStatus.PENDING,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
      };

      vi.mocked(api.post).mockResolvedValue({
        success: true,
        data: mockTicket,
      });

      const result = await ticketService.addTagToTicket(1, 2);
      expect(result).toEqual(mockTicket);
      expect(api.post).toHaveBeenCalledWith('/tickets/1/tags/2');
    });
  });

  describe('removeTagFromTicket', () => {
    it('应该从 ticket 删除标签', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        status: TicketStatus.PENDING,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        tags: [],
      };

      vi.mocked(api.delete).mockResolvedValue({
        success: true,
        data: mockTicket,
      });

      const result = await ticketService.removeTagFromTicket(1, 2);
      expect(result).toEqual(mockTicket);
      expect(api.delete).toHaveBeenCalledWith('/tickets/1/tags/2');
    });
  });
});
