import { Router } from 'express';
import { body } from 'express-validator';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import type { ApiResponse } from '../types/api.js';

const router = Router();

// GET /api/tags – Public
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const tags = await prisma.tag.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: 'asc' },
    });

    const data = tags.map(t => ({
      id: t.id,
      name: t.name,
      count: t._count.posts,
    }));

    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  }),
);

// POST /api/tags – Admin only
router.post(
  '/',
  authenticateJWT,
  requireAdmin,
  [body('name').trim().notEmpty().withMessage('Tag name is required')],
  validate,
  asyncHandler(async (req, res) => {
    const { name } = req.body;

    const existing = await prisma.tag.findUnique({ where: { name } });
    if (existing) {
      const response: ApiResponse = { success: false, error: 'Tag already exists' };
      res.status(409).json(response);
      return;
    }

    const tag = await prisma.tag.create({ data: { name } });
    const response: ApiResponse<typeof tag> = { success: true, data: tag };
    res.status(201).json(response);
  }),
);

// DELETE /api/tags/:id – Admin only
router.delete(
  '/:id',
  authenticateJWT,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const id = req.params.id as string;

    const tag = await prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      const response: ApiResponse = { success: false, error: 'Tag not found' };
      res.status(404).json(response);
      return;
    }

    // Delete associated PostTag entries first
    await prisma.postTag.deleteMany({ where: { tagId: id } });
    await prisma.tag.delete({ where: { id } });

    const response: ApiResponse = { success: true, message: 'Tag deleted' };
    res.json(response);
  }),
);

export default router;
