// Project Alpha - Tag Routes
import { Router } from 'express';
import tagController from '../controllers/tag.controller';
import { validateBody, validateParams } from '../middlewares/validate.middleware';

const router = Router();

/**
 * GET /api/tags
 * 获取所有标签
 */
router.get('/', tagController.getAllTags);

/**
 * GET /api/tags/:id
 * 根据 ID 获取标签
 */
router.get('/:id', validateParams('id'), tagController.getTagById);

/**
 * POST /api/tags
 * 创建标签
 */
router.post(
  '/',
  validateBody({
    name: { required: true, type: 'string', maxLength: 50 },
    color: { required: false, type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/ }
  }),
  tagController.createTag
);

/**
 * DELETE /api/tags/:id
 * 删除标签
 */
router.delete('/:id', validateParams('id'), tagController.deleteTag);

/**
 * GET /api/tags/:id/ticket-count
 * 获取标签关联的 Ticket 数量
 */
router.get('/:id/ticket-count', validateParams('id'), tagController.getTagTicketCount);

export default router;
