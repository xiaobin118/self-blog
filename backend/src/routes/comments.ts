import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { sanitizeBody } from '../middleware/sanitize.js';
import { commentLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getComments,
  createComment,
  deleteComment,
  approveComment,
} from '../controllers/commentController.js';

const router = Router();

// GET /api/comments?postId=xxx – Public
router.get('/', asyncHandler(getComments));

// POST /api/comments – Requires login
router.post(
  '/',
  commentLimiter,
  authenticateJWT,
  sanitizeBody(['content']),
  [
    body('postId').trim().notEmpty().withMessage('postId is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('parentId').optional().trim().notEmpty().withMessage('parentId cannot be empty'),
  ],
  validate,
  asyncHandler(createComment),
);

// DELETE /api/comments/:id – Admin or comment author
router.delete('/:id', authenticateJWT, asyncHandler(deleteComment));

// PUT /api/comments/:id/approve – Admin only
router.put('/:id/approve', authenticateJWT, requireAdmin, asyncHandler(approveComment));

export default router;
