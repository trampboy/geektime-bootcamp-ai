/**
 * Tests for error handler middleware
 */
import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler } from '../error-handler';

describe('Error Handler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it('should handle AppError correctly', () => {
    const error = new AppError('Test error', 400, 'TEST_ERROR');
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Test error',
        code: 'TEST_ERROR',
      },
    });
  });

  it('should handle AppError without code', () => {
    const error = new AppError('Test error', 404);
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Test error',
      },
    });
  });

  it('should handle generic Error', () => {
    const error = new Error('Generic error');
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Generic error',
      },
    });
  });

  it('should handle unknown error types', () => {
    const error = { message: 'Unknown error' } as unknown as Error;
    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Internal server error',
      },
    });
  });
});

describe('AppError', () => {
  it('should create AppError with all properties', () => {
    const error = new AppError('Test', 400, 'TEST_CODE');
    expect(error.message).toBe('Test');
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe('TEST_CODE');
    expect(error.name).toBe('AppError');
  });

  it('should create AppError with default status code', () => {
    const error = new AppError('Test');
    expect(error.statusCode).toBe(500);
  });
});
