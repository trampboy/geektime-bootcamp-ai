/**
 * Error handling middleware
 * Returns camelCase ErrorResponse format
 */
import { Request, Response, NextFunction } from 'express';

export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}

export class AppError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let code: string | undefined;
  let message = 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  const errorResponse: ErrorResponse = {
    error: {
      message,
      ...(code && { code }),
    },
  };

  res.status(statusCode).json(errorResponse);
}
