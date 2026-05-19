import { validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types/api.js';

export function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const response: ApiResponse = {
      success: false,
      error: 'Validation failed',
      message: errors.array().map(e => e.msg).join(', '),
    };
    res.status(400).json(response);
    return;
  }
  next();
}
