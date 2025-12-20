// Project Alpha - Ticket Routes
import { Router } from 'express';
import ticketController from '../controllers/ticket.controller';
import { validateBody, validateParams } from '../middlewares/validate.middleware';

const router = Router();

/**
 * GET /api/tickets
 * 获取所有 Tickets（支持筛选）
 */
router.get('/', ticketController.getAllTickets);

/**
 * GET /api/tickets/:id
 * 根据 ID 获取 Ticket
 */
router.get('/:id', validateParams('id'), ticketController.getTicketById);

/**
 * POST /api/tickets
 * 创建 Ticket
 */
router.post(
  '/',
  validateBody({
    title: { required: true, type: 'string', maxLength: 255 },
    description: { required: false, type: 'string' },
    tags: { required: false, type: 'array' }
  }),
  ticketController.createTicket
);

/**
 * PUT /api/tickets/:id
 * 更新 Ticket
 */
router.put(
  '/:id',
  validateParams('id'),
  validateBody({
    title: { required: false, type: 'string', maxLength: 255 },
    description: { required: false, type: 'string' }
  }),
  ticketController.updateTicket
);

/**
 * DELETE /api/tickets/:id
 * 删除 Ticket
 */
router.delete('/:id', validateParams('id'), ticketController.deleteTicket);

/**
 * PATCH /api/tickets/:id/status
 * 更新 Ticket 状态
 */
router.patch('/:id/status', validateParams('id'), ticketController.updateTicketStatus);

/**
 * PUT /api/tickets/:ticketId/tags
 * 批量设置 Ticket 标签
 */
router.put(
  '/:ticketId/tags',
  validateParams('ticketId'),
  validateBody({
    tags: { required: false, type: 'array' }
  }),
  ticketController.setTicketTags
);

/**
 * POST /api/tickets/:ticketId/tags/:tagId
 * 添加标签到 Ticket
 */
router.post(
  '/:ticketId/tags/:tagId',
  validateParams('ticketId'),
  validateParams('tagId'),
  ticketController.addTagToTicket
);

/**
 * DELETE /api/tickets/:ticketId/tags/:tagId
 * 从 Ticket 删除标签
 */
router.delete(
  '/:ticketId/tags/:tagId',
  validateParams('ticketId'),
  validateParams('tagId'),
  ticketController.removeTagFromTicket
);

export default router;
