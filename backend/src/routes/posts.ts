import { Router } from 'express';
import { body } from 'express-validator';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';

const router = Router();

// GET /api/posts – Public
router.get('/', asyncHandler(getPosts));

// GET /api/posts/:slug – Public
router.get('/:slug', asyncHandler(getPostBySlug));

// POST /api/posts – Admin only
router.post(
  '/',
  authenticateJWT,
  requireAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('summary').trim().notEmpty().withMessage('Summary is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ],
  validate,
  asyncHandler(createPost),
);

// PUT /api/posts/:id – Admin only
router.put(
  '/:id',
  authenticateJWT,
  requireAdmin,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
    body('summary').optional().trim().notEmpty().withMessage('Summary cannot be empty'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ],
  validate,
  asyncHandler(updatePost),
);

// DELETE /api/posts/:id – Admin only
router.delete('/:id', authenticateJWT, requireAdmin, asyncHandler(deletePost));

export default router;
