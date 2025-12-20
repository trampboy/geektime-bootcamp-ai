// Project Alpha - Ticket Controller
import { Request, Response, NextFunction } from 'express';
import ticketService from '../services/ticket.service';
import { successResponse } from '../utils/response';
import { CreateTicketDto, UpdateTicketDto, TicketStatus, TicketFilters } from '../types';
import { AppError } from '../middlewares/error.middleware';

/**
 * Ticket Controller
 */
export class TicketController {
  /**
   * 获取所有 Tickets（支持筛选）
   * GET /api/tickets
   */
  getAllTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: TicketFilters = {
        status: req.query.status as string,
        search: req.query.search as string,
        tags: req.query.tags as string
      };

      const tickets = await ticketService.getAllTickets(filters);
      successResponse(res, tickets);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 根据 ID 获取 Ticket
   * GET /api/tickets/:id
   */
  getTicketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('无效的 Ticket ID', 400, 'VALIDATION_ERROR');
      }

      const ticket = await ticketService.getTicketById(id);
      successResponse(res, ticket);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 创建 Ticket
   * POST /api/tickets
   */
  createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateTicketDto = req.body;
      const ticket = await ticketService.createTicket(dto);
      successResponse(res, ticket, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新 Ticket
   * PUT /api/tickets/:id
   */
  updateTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('无效的 Ticket ID', 400, 'VALIDATION_ERROR');
      }

      const dto: UpdateTicketDto = req.body;
      const ticket = await ticketService.updateTicket(id, dto);
      successResponse(res, ticket);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除 Ticket
   * DELETE /api/tickets/:id
   */
  deleteTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('无效的 Ticket ID', 400, 'VALIDATION_ERROR');
      }

      await ticketService.deleteTicket(id);
      successResponse(res, { message: 'Ticket 删除成功' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 更新 Ticket 状态
   * PATCH /api/tickets/:id/status
   */
  updateTicketStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('无效的 Ticket ID', 400, 'VALIDATION_ERROR');
      }

      const { status } = req.body;
      if (!status || (status !== 'pending' && status !== 'completed')) {
        throw new AppError('无效的状态值，应为 pending 或 completed', 400, 'VALIDATION_ERROR');
      }

      const ticket = await ticketService.updateTicketStatus(id, status as TicketStatus);
      successResponse(res, ticket);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 批量设置 Ticket 标签
   * PUT /api/tickets/:ticketId/tags
   */
  setTicketTags = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.ticketId, 10);
      if (isNaN(ticketId) || ticketId <= 0) {
        throw new AppError('无效的 Ticket ID', 400, 'VALIDATION_ERROR');
      }

      const { tags } = req.body;
      // tags 可以是数组或未定义（未定义时视为空数组，清除所有标签）
      const tagIds: number[] = [];
      
      if (tags !== undefined) {
        if (!Array.isArray(tags)) {
          throw new AppError('标签列表必须是数组', 400, 'VALIDATION_ERROR');
        }

        tagIds.push(...tags.map((tag: any) => {
          const id = typeof tag === 'number' ? tag : parseInt(tag, 10);
          if (isNaN(id) || id <= 0) {
            throw new AppError('无效的标签 ID', 400, 'VALIDATION_ERROR');
          }
          return id;
        }));
      }

      const ticket = await ticketService.setTicketTags(ticketId, tagIds);
      successResponse(res, ticket);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 添加标签到 Ticket
   * POST /api/tickets/:ticketId/tags/:tagId
   */
  addTagToTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.ticketId, 10);
      const tagId = parseInt(req.params.tagId, 10);

      if (isNaN(ticketId) || ticketId <= 0) {
        throw new AppError('无效的 Ticket ID', 400, 'VALIDATION_ERROR');
      }
      if (isNaN(tagId) || tagId <= 0) {
        throw new AppError('无效的标签 ID', 400, 'VALIDATION_ERROR');
      }

      const ticket = await ticketService.addTagToTicket(ticketId, tagId);
      successResponse(res, ticket);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 从 Ticket 删除标签
   * DELETE /api/tickets/:ticketId/tags/:tagId
   */
  removeTagFromTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ticketId = parseInt(req.params.ticketId, 10);
      const tagId = parseInt(req.params.tagId, 10);

      if (isNaN(ticketId) || ticketId <= 0) {
        throw new AppError('无效的 Ticket ID', 400, 'VALIDATION_ERROR');
      }
      if (isNaN(tagId) || tagId <= 0) {
        throw new AppError('无效的标签 ID', 400, 'VALIDATION_ERROR');
      }

      const ticket = await ticketService.removeTagFromTicket(ticketId, tagId);
      successResponse(res, ticket);
    } catch (error) {
      next(error);
    }
  };
}

export default new TicketController();
