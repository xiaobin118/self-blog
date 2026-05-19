import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import type { ApiResponse } from '../types/api.js';
import type { JwtPayload } from '../types/jwt.js';

// GET /api/comments?postId=xxx
export async function getComments(req: Request, res: Response) {
  const postId = req.query.postId as string;

  if (!postId) {
    const response: ApiResponse = { success: false, error: 'postId is required' };
    res.status(400).json(response);
    return;
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      user: { select: { id: true, username: true, avatarUrl: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const response: ApiResponse<typeof comments> = { success: true, data: comments };
  res.json(response);
}

// POST /api/comments
export async function createComment(req: Request, res: Response) {
  const { postId, content, parentId } = req.body;
  const { userId } = req.user as JwtPayload;

  // Verify post exists
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    const response: ApiResponse = { success: false, error: 'Post not found' };
    res.status(404).json(response);
    return;
  }

  // Verify parent comment exists if provided
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (!parent || parent.postId !== postId) {
      const response: ApiResponse = { success: false, error: 'Parent comment not found' };
      res.status(404).json(response);
      return;
    }
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId,
      parentId: parentId ?? null,
    },
    include: {
      user: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  const response: ApiResponse<typeof comment> = { success: true, data: comment };
  res.status(201).json(response);
}

// DELETE /api/comments/:id
export async function deleteComment(req: Request, res: Response) {
  const id = req.params.id as string;
  const { userId, role } = req.user as JwtPayload;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    const response: ApiResponse = { success: false, error: 'Comment not found' };
    res.status(404).json(response);
    return;
  }

  // Only admin or comment author can delete
  if (role !== 'ADMIN' && comment.userId !== userId) {
    const response: ApiResponse = { success: false, error: 'Forbidden' };
    res.status(403).json(response);
    return;
  }

  await prisma.comment.delete({ where: { id } });

  const response: ApiResponse = { success: true, message: 'Comment deleted' };
  res.json(response);
}

// PUT /api/comments/:id/approve
export async function approveComment(req: Request, res: Response) {
  const id = req.params.id as string;

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    const response: ApiResponse = { success: false, error: 'Comment not found' };
    res.status(404).json(response);
    return;
  }

  const updated = await prisma.comment.update({
    where: { id },
    data: { isApproved: true },
    include: {
      user: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  const response: ApiResponse<typeof updated> = { success: true, data: updated };
  res.json(response);
}
