import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
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

export default router;
