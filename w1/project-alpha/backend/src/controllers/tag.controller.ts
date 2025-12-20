// Project Alpha - Tag Controller
import { Request, Response, NextFunction } from 'express';
import tagService from '../services/tag.service';
import { successResponse } from '../utils/response';
import { CreateTagDto } from '../types';
import { AppError } from '../middlewares/error.middleware';

/**
 * Tag Controller
 */
export class TagController {
  /**
   * 获取所有标签
   * GET /api/tags
   */
  getAllTags = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tags = await tagService.getAllTags();
      successResponse(res, tags);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 根据 ID 获取标签
   * GET /api/tags/:id
   */
  getTagById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('无效的标签 ID', 400, 'VALIDATION_ERROR');
      }

      const tag = await tagService.getTagById(id);
      successResponse(res, tag);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 创建标签
   * POST /api/tags
   */
  createTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto: CreateTagDto = req.body;
      const tag = await tagService.createTag(dto);
      successResponse(res, tag, 201);
    } catch (error) {
      next(error);
    }
  };

  /**
   * 删除标签
   * DELETE /api/tags/:id
   */
  deleteTag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('无效的标签 ID', 400, 'VALIDATION_ERROR');
      }

      await tagService.deleteTag(id);
      successResponse(res, { message: '标签删除成功' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * 获取标签关联的 Ticket 数量
   * GET /api/tags/:id/ticket-count
   */
  getTagTicketCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id) || id <= 0) {
        throw new AppError('无效的标签 ID', 400, 'VALIDATION_ERROR');
      }

      const count = await tagService.getTagTicketCount(id);
      successResponse(res, { count });
    } catch (error) {
      next(error);
    }
  };
}

export default new TagController();
