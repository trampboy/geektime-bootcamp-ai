/**
 * Project Alpha - Ticket Controller 单元测试
 */
import { Request, Response, NextFunction } from 'express';
import { TicketController } from '../../controllers/ticket.controller';
import ticketService from '../../services/ticket.service';
import { AppError } from '../../middlewares/error.middleware';
import { Ticket, TicketStatus } from '../../types';

// Mock Service
jest.mock('../../services/ticket.service', () => ({
  __esModule: true,
  default: {
    getAllTickets: jest.fn(),
    getTicketById: jest.fn(),
    createTicket: jest.fn(),
    updateTicket: jest.fn(),
    deleteTicket: jest.fn(),
    updateTicketStatus: jest.fn(),
    setTicketTags: jest.fn()
  }
}));

describe('TicketController', () => {
  let controller: TicketController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    controller = new TicketController();
    jest.clearAllMocks();

    mockRequest = {
      params: {},
      query: {},
      body: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();
  });

  describe('getAllTickets', () => {
    it('应该返回所有 Tickets', async () => {
      const mockTickets: Ticket[] = [
        {
          id: 1,
          title: 'Test Ticket',
          description: 'Test Description',
          status: TicketStatus.PENDING,
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: []
        }
      ];

      (ticketService.getAllTickets as jest.Mock).mockResolvedValue(mockTickets);
      mockRequest.query = {};

      await controller.getAllTickets(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.getAllTickets).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockTickets
      });
    });

    it('应该传递筛选参数', async () => {
      mockRequest.query = {
        status: 'pending',
        search: 'test',
        tags: '1,2'
      };

      await controller.getAllTickets(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.getAllTickets).toHaveBeenCalledWith({
        status: 'pending',
        search: 'test',
        tags: '1,2'
      });
    });

    it('应该在 Service 抛出错误时调用 next', async () => {
      const error = new AppError('Database error', 500);
      (ticketService.getAllTickets as jest.Mock).mockRejectedValue(error);

      await controller.getAllTickets(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getTicketById', () => {
    it('应该返回指定 ID 的 Ticket', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: []
      };

      (ticketService.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
      mockRequest.params = { id: '1' };

      await controller.getTicketById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.getTicketById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('应该拒绝无效的 ID', async () => {
      mockRequest.params = { id: 'invalid' };

      await controller.getTicketById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: '无效的 Ticket ID'
        })
      );
    });

    it('应该拒绝负数 ID', async () => {
      mockRequest.params = { id: '-1' };

      await controller.getTicketById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400
        })
      );
    });
  });

  describe('createTicket', () => {
    it('应该成功创建 Ticket', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'New Ticket',
        description: 'New Description',
        status: TicketStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: []
      };

      (ticketService.createTicket as jest.Mock).mockResolvedValue(mockTicket);
      mockRequest.body = {
        title: 'New Ticket',
        description: 'New Description'
      };

      await controller.createTicket(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.createTicket).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });
  });

  describe('updateTicket', () => {
    it('应该成功更新 Ticket', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Updated Ticket',
        description: 'Updated Description',
        status: TicketStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: []
      };

      (ticketService.updateTicket as jest.Mock).mockResolvedValue(mockTicket);
      mockRequest.params = { id: '1' };
      mockRequest.body = {
        title: 'Updated Ticket',
        description: 'Updated Description'
      };

      await controller.updateTicket(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.updateTicket).toHaveBeenCalledWith(1, mockRequest.body);
    });
  });

  describe('deleteTicket', () => {
    it('应该成功删除 Ticket', async () => {
      (ticketService.deleteTicket as jest.Mock).mockResolvedValue(undefined);
      mockRequest.params = { id: '1' };

      await controller.deleteTicket(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.deleteTicket).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { message: 'Ticket 删除成功' }
      });
    });
  });

  describe('updateTicketStatus', () => {
    it('应该成功更新 Ticket 状态', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.COMPLETED,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: []
      };

      (ticketService.updateTicketStatus as jest.Mock).mockResolvedValue(mockTicket);
      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'completed' };

      await controller.updateTicketStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.updateTicketStatus).toHaveBeenCalledWith(1, 'completed');
    });

    it('应该拒绝无效的状态值', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { status: 'invalid' };

      await controller.updateTicketStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: expect.stringContaining('无效的状态值')
        })
      );
    });
  });

  describe('setTicketTags', () => {
    it('应该成功设置 Ticket 标签', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: []
      };

      (ticketService.setTicketTags as jest.Mock).mockResolvedValue(mockTicket);
      mockRequest.params = { ticketId: '1' };
      mockRequest.body = { tags: [1, 2] };

      await controller.setTicketTags(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.setTicketTags).toHaveBeenCalledWith(1, [1, 2]);
    });

    it('应该拒绝非数组的标签列表', async () => {
      mockRequest.params = { ticketId: '1' };
      mockRequest.body = { tags: 'not-an-array' };

      await controller.setTicketTags(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: '标签列表必须是数组'
        })
      );
    });

    it('应该允许空标签数组（清除所有标签）', async () => {
      const mockTicket: Ticket = {
        id: 1,
        title: 'Test Ticket',
        description: 'Test Description',
        status: TicketStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: []
      };

      (ticketService.setTicketTags as jest.Mock).mockResolvedValue(mockTicket);
      mockRequest.params = { ticketId: '1' };
      mockRequest.body = { tags: [] };

      await controller.setTicketTags(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(ticketService.setTicketTags).toHaveBeenCalledWith(1, []);
    });
  });
});
