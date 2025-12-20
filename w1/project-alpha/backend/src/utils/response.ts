// Project Alpha - 统一响应格式工具
import { Response } from 'express';
import { ApiResponse } from '../types';

/**
 * 成功响应
 */
export const successResponse = <T>(res: Response, data: T, statusCode: number = 200): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data
  };
  return res.status(statusCode).json(response);
};

/**
 * 成功响应（带消息）
 */
export const successMessageResponse = (res: Response, message: string, statusCode: number = 200): Response => {
  const response: ApiResponse = {
    success: true,
    message
  };
  return res.status(statusCode).json(response);
};

/**
 * 错误响应
 */
export const errorResponse = (
  res: Response,
  code: string,
  message: string,
  statusCode: number = 500
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message
    }
  };
  return res.status(statusCode).json(response);
};
