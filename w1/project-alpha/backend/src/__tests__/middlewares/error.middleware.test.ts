/**
 * Project Alpha - Error Middleware 单元测试
 */
import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler, notFoundHandler } from '../../middlewares/error.middleware';
import { errorResponse } from '../../utils/response';

// Mock logger
jest.mock('../../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

// Mock response utils
jest.mock('../../utils/response', () => ({
  errorResponse: jest.fn()
}));

describe('Error Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('AppError', () => {
    it('应该创建自定义错误', () => {
      const error = new AppError('Test error', 400, 'TEST_ERROR');

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error).toBeInstanceOf(Error);
    });

    it('应该使用默认值', () => {
      const error = new AppError('Test error');

      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('errorHandler', () => {
    it('应该处理 AppError', () => {
      const error = new AppError('Custom error', 404, 'NOT_FOUND');
      const mockResponseObj = mockResponse as Response;

      (errorResponse as jest.Mock).mockReturnValue(mockResponseObj);

      const result = errorHandler(
        error,
        mockRequest as Request,
        mockResponseObj,
        mockNext
      );

      expect(errorResponse).toHaveBeenCalledWith(
        mockResponseObj,
        'NOT_FOUND',
        'Custom error',
        404
      );
      expect(result).toBe(mockResponseObj);
    });

    it('应该处理 MySQL 重复条目错误', () => {
      const error: any = new Error('Duplicate entry');
      error.code = 'ER_DUP_ENTRY';
      const mockResponseObj = mockResponse as Response;

      (errorResponse as jest.Mock).mockReturnValue(mockResponseObj);

      errorHandler(error, mockRequest as Request, mockResponseObj, mockNext);

      expect(errorResponse).toHaveBeenCalledWith(
        mockResponseObj,
        'DUPLICATE_ENTRY',
        '资源已存在',
        409
      );
    });

    it('应该处理 MySQL 外键错误', () => {
      const error: any = new Error('Foreign key constraint');
      error.code = 'ER_NO_REFERENCED_ROW_2';
      const mockResponseObj = mockResponse as Response;

      (errorResponse as jest.Mock).mockReturnValue(mockResponseObj);

      errorHandler(error, mockRequest as Request, mockResponseObj, mockNext);

      expect(errorResponse).toHaveBeenCalledWith(
        mockResponseObj,
        'NOT_FOUND',
        '关联的资源不存在',
        404
      );
    });

    it('应该处理 MySQL 字段错误', () => {
      const error: any = new Error('Bad field');
      error.code = 'ER_BAD_FIELD_ERROR';
      const mockResponseObj = mockResponse as Response;

      (errorResponse as jest.Mock).mockReturnValue(mockResponseObj);

      errorHandler(error, mockRequest as Request, mockResponseObj, mockNext);

      expect(errorResponse).toHaveBeenCalledWith(
        mockResponseObj,
        'BAD_REQUEST',
        '请求参数错误',
        400
      );
    });

    it('应该处理通用错误（生产环境）', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Generic error');
      const mockResponseObj = mockResponse as Response;

      (errorResponse as jest.Mock).mockReturnValue(mockResponseObj);

      errorHandler(error, mockRequest as Request, mockResponseObj, mockNext);

      expect(errorResponse).toHaveBeenCalledWith(
        mockResponseObj,
        'INTERNAL_SERVER_ERROR',
        '服务器内部错误',
        500
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('应该在开发环境显示详细错误信息', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Generic error');
      const mockResponseObj = mockResponse as Response;

      (errorResponse as jest.Mock).mockReturnValue(mockResponseObj);

      errorHandler(error, mockRequest as Request, mockResponseObj, mockNext);

      expect(errorResponse).toHaveBeenCalledWith(
        mockResponseObj,
        'INTERNAL_SERVER_ERROR',
        'Generic error',
        500
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('notFoundHandler', () => {
    it('应该返回 404 错误', () => {
      const mockResponseObj = mockResponse as Response;

      (errorResponse as jest.Mock).mockReturnValue(mockResponseObj);

      const result = notFoundHandler(
        mockRequest as Request,
        mockResponseObj
      );

      expect(errorResponse).toHaveBeenCalledWith(
        mockResponseObj,
        'NOT_FOUND',
        '路由不存在',
        404
      );
      expect(result).toBe(mockResponseObj);
    });
  });
});
