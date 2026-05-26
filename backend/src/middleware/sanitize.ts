import xss from 'xss';
import type { Request, Response, NextFunction } from 'express';

function sanitizeString(str: string): string {
  return xss(str, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style'],
  });
}

export function sanitizeBody(fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) {
      for (const field of fields) {
        if (typeof req.body[field] === 'string') {
          req.body[field] = sanitizeString(req.body[field]);
        }
      }
    }
    next();
  };
}
