// Project Alpha - 验证中间件
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

/**
 * 验证请求体中间件
 * 用于验证请求体的格式和内容
 */
export const validateBody = (schema: {
  title?: { required?: boolean; type?: string; maxLength?: number };
  description?: { required?: boolean; type?: string; maxLength?: number };
  name?: { required?: boolean; type?: string; maxLength?: number };
  color?: { required?: boolean; type?: string; pattern?: RegExp };
  tags?: { required?: boolean; type?: string };
}) => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const body = req.body;

    // 验证 title
    if (schema.title) {
      if (schema.title.required && (!body.title || typeof body.title !== 'string')) {
        return errorResponse(res, 'VALIDATION_ERROR', '标题是必填项', 400);
      }
      if (body.title && typeof body.title !== 'string') {
        return errorResponse(res, 'VALIDATION_ERROR', '标题必须是字符串', 400);
      }
      if (body.title && schema.title.maxLength && body.title.length > schema.title.maxLength) {
        return errorResponse(res, 'VALIDATION_ERROR', `标题长度不能超过 ${schema.title.maxLength} 个字符`, 400);
      }
      if (body.title && body.title.trim().length === 0) {
        return errorResponse(res, 'VALIDATION_ERROR', '标题不能为空', 400);
      }
    }

    // 验证 description
    if (schema.description) {
      if (schema.description.required && (!body.description || typeof body.description !== 'string')) {
        return errorResponse(res, 'VALIDATION_ERROR', '描述是必填项', 400);
      }
      if (body.description && typeof body.description !== 'string') {
        return errorResponse(res, 'VALIDATION_ERROR', '描述必须是字符串', 400);
      }
      if (body.description && schema.description.maxLength && body.description.length > schema.description.maxLength) {
        return errorResponse(res, 'VALIDATION_ERROR', `描述长度不能超过 ${schema.description.maxLength} 个字符`, 400);
      }
    }

    // 验证 name (Tag)
    if (schema.name) {
      if (schema.name.required && (!body.name || typeof body.name !== 'string')) {
        return errorResponse(res, 'VALIDATION_ERROR', '标签名称是必填项', 400);
      }
      if (body.name && typeof body.name !== 'string') {
        return errorResponse(res, 'VALIDATION_ERROR', '标签名称必须是字符串', 400);
      }
      if (body.name && schema.name.maxLength && body.name.length > schema.name.maxLength) {
        return errorResponse(res, 'VALIDATION_ERROR', `标签名称长度不能超过 ${schema.name.maxLength} 个字符`, 400);
      }
      if (body.name && body.name.trim().length === 0) {
        return errorResponse(res, 'VALIDATION_ERROR', '标签名称不能为空', 400);
      }
    }

    // 验证 color
    if (schema.color) {
      if (schema.color.required && !body.color) {
        return errorResponse(res, 'VALIDATION_ERROR', '颜色是必填项', 400);
      }
      if (body.color && typeof body.color !== 'string') {
        return errorResponse(res, 'VALIDATION_ERROR', '颜色必须是字符串', 400);
      }
      if (body.color && schema.color.pattern && !schema.color.pattern.test(body.color)) {
        return errorResponse(res, 'VALIDATION_ERROR', '颜色格式不正确，应为 #RRGGBB 格式', 400);
      }
    }

    // 验证 tags
    if (schema.tags) {
      if (schema.tags.required && (!body.tags || !Array.isArray(body.tags))) {
        return errorResponse(res, 'VALIDATION_ERROR', '标签列表是必填项且必须是数组', 400);
      }
      if (body.tags && !Array.isArray(body.tags)) {
        return errorResponse(res, 'VALIDATION_ERROR', '标签列表必须是数组', 400);
      }
      if (body.tags && body.tags.some((tag: any) => typeof tag !== 'number')) {
        return errorResponse(res, 'VALIDATION_ERROR', '标签列表中的元素必须是数字', 400);
      }
    }

    next();
  };
};

/**
 * 验证路径参数中间件
 */
export const validateParams = (paramName: string, type: 'number' = 'number') => {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const param = req.params[paramName];
    
    if (!param) {
      return errorResponse(res, 'VALIDATION_ERROR', `路径参数 ${paramName} 缺失`, 400);
    }

    if (type === 'number') {
      const num = parseInt(param, 10);
      if (isNaN(num) || num <= 0) {
        return errorResponse(res, 'VALIDATION_ERROR', `路径参数 ${paramName} 必须是正整数`, 400);
      }
      // 将验证后的数字保存到 req.params
      req.params[paramName] = num.toString();
    }

    next();
  };
};
