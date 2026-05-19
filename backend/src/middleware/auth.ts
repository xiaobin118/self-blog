import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { ApiResponse } from '../types/api.js';
import type { JwtPayload } from '../types/jwt.js';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    const response: ApiResponse = { success: false, error: 'No token provided' };
    res.status(401).json(response);
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    const response: ApiResponse = { success: false, error: 'Invalid or expired token' };
    res.status(401).json(response);
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    const response: ApiResponse = { success: false, error: 'Admin access required' };
    res.status(403).json(response);
    return;
  }
  next();
}
