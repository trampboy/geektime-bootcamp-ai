// Project Alpha - 错误处理中间件
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * 自定义错误类
 */
export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 错误处理中间件
 */
export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // 记录错误日志
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });

  // 如果是自定义错误，使用自定义状态码和错误码
  if (err instanceof AppError) {
    return errorResponse(res, err.code, err.message, err.statusCode);
  }

  // MySQL 错误处理
  if (err.name === 'Error' && 'code' in err) {
    const mysqlError = err as any;
    if (mysqlError.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'DUPLICATE_ENTRY', '资源已存在', 409);
    }
    if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
      return errorResponse(res, 'NOT_FOUND', '关联的资源不存在', 404);
    }
    if (mysqlError.code === 'ER_BAD_FIELD_ERROR') {
      return errorResponse(res, 'BAD_REQUEST', '请求参数错误', 400);
    }
  }

  // 默认错误响应
  return errorResponse(
    res,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
    500
  );
};

/**
 * 404 处理中间件
 */
export const notFoundHandler = (_req: Request, res: Response): Response => {
  return errorResponse(res, 'NOT_FOUND', '路由不存在', 404);
};
