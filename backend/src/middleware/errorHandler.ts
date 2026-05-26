import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/api.js';

// Express requires 4 parameters for error handlers
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
) {
  console.error('Unhandled error:', err);

  const response: ApiResponse = {
    success: false,
    error: err.message || 'Internal Server Error',
  };

  res.status(500).json(response);
}
